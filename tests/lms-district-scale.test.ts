import { describe, expect, it } from 'vitest'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'
import { buildAttendanceCsv, buildGradebookCsv, buildReportCards, buildSisExportPackage } from '@/lib/lms/exports'
import { validateDistrictProofProfile, type DistrictProofProfile } from '@/lib/lms/district-proof'
import { parseOneRosterBundle } from '@/lib/lms/oneroster'
import { validateSsoConfig } from '@/lib/lms/sso'
import demoDistrictProfile from '@/fixtures/district/canvas-replacement-demo.json'

describe('district-scale Canvas replacement operations', () => {
  it('validates a OneRoster CSV bundle for district SIS onboarding', () => {
    const result = parseOneRosterBundle({
      orgs: 'sourcedId,name,type\nschool-1,WolfWhale Academy,school\n',
      users:
        'sourcedId,username,givenName,familyName,role,email,orgSourcedIds\nstudent-1,alex,Alex,Student,student,alex@example.edu,school-1\nteacher-1,tessa,Tessa,Teacher,teacher,tessa@example.edu,school-1\n',
      courses: 'sourcedId,title,courseCode,orgSourcedId\ncourse-1,Grade 8 Humanities,HUM8,school-1\n',
      classes:
        'sourcedId,title,courseSourcedId,schoolSourcedId,termSourcedIds\nclass-1,Humanities 8A,course-1,school-1,term-1\n',
      enrollments:
        'sourcedId,classSourcedId,schoolSourcedId,userSourcedId,role,primary\nmembership-1,class-1,school-1,student-1,student,true\nmembership-2,class-1,school-1,teacher-1,teacher,true\n',
    })

    expect(result.errors).toEqual([])
    expect(result.summary).toEqual({
      orgs: 1,
      users: 2,
      courses: 1,
      classes: 1,
      enrollments: 2,
    })
  })

  it('rejects unsafe OneRoster bundles before import', () => {
    const result = parseOneRosterBundle({
      orgs: 'sourcedId,name,type\nschool-1,WolfWhale Academy,school\n',
      users: 'sourcedId,username,givenName,familyName,role,email,orgSourcedIds\nstudent-1,alex,Alex,Student,owner,not-email,missing-school\n',
      courses: 'sourcedId,title,courseCode,orgSourcedId\ncourse-1,Grade 8 Humanities,HUM8,missing-school\n',
      classes:
        'sourcedId,title,courseSourcedId,schoolSourcedId,termSourcedIds\nclass-1,Humanities 8A,missing-course,school-1,term-1\n',
      enrollments:
        'sourcedId,classSourcedId,schoolSourcedId,userSourcedId,role,primary\nmembership-1,class-1,school-1,missing-user,student,true\n',
    })

    expect(result.rows).toEqual({ orgs: [], users: [], courses: [], classes: [], enrollments: [] })
    expect(result.errors).toEqual([
      'users row 2: role must be administrator, aide, guardian, parent, proctor, relative, student, or teacher.',
      'users row 2: email must be a valid address.',
      'users row 2: orgSourcedIds references unknown org missing-school.',
      'courses row 2: orgSourcedId references unknown org missing-school.',
      'classes row 2: courseSourcedId references unknown course missing-course.',
      'enrollments row 2: userSourcedId references unknown user missing-user.',
    ])
  })

  it('builds gradebook, attendance, report-card, and SIS export files', () => {
    const records = createDemoLmsRecords()
    const views = buildLmsDashboardViews(records)

    expect(buildGradebookCsv(views.teacher.gradebook)).toContain('course_id,course_title,student_id,student_name,current_percentage,letter_grade,graded_assignments,missing_assignments,attendance_rate,risk_level')
    expect(buildAttendanceCsv(views.admin.attendance)).toContain('course_id,course_title,present,absent,tardy,excused,online,attendance_rate')
    expect(buildReportCards(records)).toEqual(expect.arrayContaining([
      expect.objectContaining({
        studentName: 'Alex Student',
        courses: [expect.objectContaining({ courseTitle: 'Grade 8 Humanities', currentPercentage: 90, letterGrade: 'A-' })],
      }),
    ]))

    expect(Object.keys(buildSisExportPackage(records, views.admin))).toEqual([
      'users.csv',
      'courses.csv',
      'enrollments.csv',
      'gradebook.csv',
      'attendance.csv',
    ])
  })

  it('validates SSO configuration contracts for enterprise sales', () => {
    expect(validateSsoConfig({ SSO_PROVIDER_TYPE: 'none' })).toEqual({ ok: true, provider: 'none', errors: [] })
    expect(
      validateSsoConfig({
        SSO_PROVIDER_TYPE: 'oidc',
        OIDC_ISSUER: 'https://identity.example.edu',
        OIDC_CLIENT_ID: 'client-id',
        OIDC_CLIENT_SECRET: 'client-secret',
      })
    ).toEqual({ ok: true, provider: 'oidc', errors: [] })
    expect(validateSsoConfig({ SSO_PROVIDER_TYPE: 'saml' }).errors).toEqual([
      'SAML_METADATA_URL is required when SSO_PROVIDER_TYPE=saml.',
      'SAML_ENTITY_ID is required when SSO_PROVIDER_TYPE=saml.',
      'SAML_ACS_URL is required when SSO_PROVIDER_TYPE=saml.',
    ])
  })

  it('validates the district Canvas replacement proof profile', () => {
    const result = validateDistrictProofProfile(demoDistrictProfile as DistrictProofProfile)

    expect(result.errors).toEqual([])
    expect(result.evidence).toEqual(
      expect.arrayContaining([
        'SSO profile validated for provider oidc.',
        'Load profile is inside verified envelope: 5000 students, 500 teachers, 1000 courses, 50000 enrollments.',
        'Restore drill command is guarded for disposable non-production restore.',
      ])
    )
  })
})
