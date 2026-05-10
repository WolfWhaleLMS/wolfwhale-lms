import { describe, expect, it } from 'vitest'
import { mapSupabaseRowsToLmsRecords } from '@/lib/lms/queries'

describe('Supabase LMS query mapping', () => {
  it('maps existing Supabase table rows into the durable LMS read model input', () => {
    const records = mapSupabaseRowsToLmsRecords({
      currentUserId: 'teacher-1',
      tenant: { id: 'tenant-1', name: 'WolfWhale School', slug: 'wolfwhale', status: 'active' },
      profiles: [{ id: 'teacher-1', first_name: 'Tessa', last_name: 'Teacher', email: 'teacher@example.test' }],
      memberships: [{ tenant_id: 'tenant-1', user_id: 'teacher-1', role: 'teacher', status: 'active' }],
      parentLinks: [],
      courses: [
        {
          id: 'course-1',
          tenant_id: 'tenant-1',
          name: 'Grade 8 Humanities',
          subject: 'Humanities',
          grade_level: '8',
          created_by: 'teacher-1',
          status: 'active',
          grading_policy: { categories: [{ name: 'Exit Ticket', weight: 100 }] },
        },
      ],
      enrollments: [
        {
          tenant_id: 'tenant-1',
          course_id: 'course-1',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          status: 'active',
        },
      ],
      assignments: [
        {
          id: 'assignment-1',
          tenant_id: 'tenant-1',
          course_id: 'course-1',
          title: 'Exit Ticket',
          instructions: 'Answer the prompt.',
          due_date: '2026-05-08T16:00:00.000Z',
          max_points: 5,
          status: 'assigned',
          category: 'Exit Ticket',
        },
      ],
      submissions: [
        {
          id: 'submission-1',
          tenant_id: 'tenant-1',
          assignment_id: 'assignment-1',
          student_id: 'student-1',
          submission_text: 'My answer',
          file_path: 'tenant-1/student-1/course-1/assignment-1/notes.pdf',
          file_name: 'notes.pdf',
          submission_url: null,
          status: 'submitted',
          submitted_at: '2026-05-07T16:00:00.000Z',
        },
      ],
      grades: [
        {
          id: 'grade-1',
          tenant_id: 'tenant-1',
          assignment_id: 'assignment-1',
          student_id: 'student-1',
          course_id: 'course-1',
          points_earned: 4,
          percentage: 80,
          letter_grade: 'B-',
          feedback: 'Good source detail.',
          graded_at: '2026-05-07T17:00:00.000Z',
          rubric_scores: [{ name: 'Evidence', points: 4 }],
        },
      ],
      notifications: [{ id: 'n1', tenant_id: 'tenant-1', user_id: 'teacher-1', title: 'New submission', message: 'Ready', read: false, created_at: '2026-05-07T16:01:00.000Z' }],
      auditTrail: [{ id: 'a1', tenant_id: 'tenant-1', action: 'submission.created', resource_type: 'submission', created_at: '2026-05-07T16:01:00.000Z' }],
      lessons: [{ id: 'lesson-1', tenant_id: 'tenant-1', course_id: 'course-1', title: 'Sources', status: 'published' }],
      resources: [{ id: 'resource-1', lesson_id: 'lesson-1', file_name: 'source.pdf', file_type: 'application/pdf', display_name: 'Source Pack' }],
      resourceReviews: [{ resource_id: 'resource-1', scan_status: 'clean', scan_provider: 'mime-allowlist-sha256', legal_hold: false, retention_expires_at: '2033-05-07T16:01:00.000Z', quarantine_reason: '' }],
      conversations: [{ id: 'conversation-1', tenant_id: 'tenant-1', subject: 'Class help', course_id: 'course-1', created_by: 'teacher-1', updated_at: '2026-05-07T16:02:00.000Z' }],
      conversationMembers: [{ conversation_id: 'conversation-1', user_id: 'teacher-1' }],
      messages: [{ id: 'message-1', tenant_id: 'tenant-1', conversation_id: 'conversation-1', sender_id: 'teacher-1', content: 'Bring notes.', created_at: '2026-05-07T16:03:00.000Z' }],
      rubrics: [
        {
          id: 'rubric-1',
          tenant_id: 'tenant-1',
          assignment_id: 'assignment-1',
          name: 'Exit Ticket Rubric',
          description: 'Evidence check',
          criteria: [{ name: 'Evidence', points: 5 }],
          created_by: 'teacher-1',
        },
      ],
      attendance: [
        {
          id: 'attendance-1',
          tenant_id: 'tenant-1',
          course_id: 'course-1',
          student_id: 'student-1',
          attendance_date: '2026-05-07',
          status: 'present',
          notes: 'On time.',
          marked_by: 'teacher-1',
        },
      ],
    })

    expect(records.tenant.name).toBe('WolfWhale School')
    expect(records.actorIds.teacher).toBe('teacher-1')
    expect(records.users[0]).toMatchObject({ id: 'teacher-1', firstName: 'Tessa', lastName: 'Teacher' })
    expect(records.courses[0]).toMatchObject({ title: 'Grade 8 Humanities', gradeLevel: '8' })
    expect(records.assignments[0]).toMatchObject({ dueAt: '2026-05-08T16:00:00.000Z', maxPoints: 5, category: 'Exit Ticket' })
    expect(records.submissions[0]).toMatchObject({
      content: 'My answer',
      filePath: 'tenant-1/student-1/course-1/assignment-1/notes.pdf',
      fileName: 'notes.pdf',
      status: 'submitted',
    })
    expect(records.grades[0]).toMatchObject({ percentage: 80, letterGrade: 'B-' })
    expect(records.notifications[0]).toMatchObject({ read: false })
    expect(records.resources[0]).toMatchObject({ displayName: 'Source Pack', fileName: 'source.pdf', scanStatus: 'clean' })
    expect(records.messages[0]).toMatchObject({ content: 'Bring notes.' })
    expect(records.rubrics[0]).toMatchObject({ name: 'Exit Ticket Rubric', criteria: [{ name: 'Evidence', points: 5 }] })
    expect(records.attendance[0]).toMatchObject({ attendanceDate: '2026-05-07', status: 'present' })
  })

  it('uses the signed-in user as the actor for their active role', () => {
    const records = mapSupabaseRowsToLmsRecords({
      currentUserId: 'student-2',
      tenant: { id: 'tenant-1', name: 'WolfWhale School', slug: 'wolfwhale', status: 'active' },
      profiles: [
        { id: 'student-1', first_name: 'Alex', last_name: 'Student' },
        { id: 'student-2', first_name: 'Riley', last_name: 'Student' },
      ],
      memberships: [
        { tenant_id: 'tenant-1', user_id: 'student-1', role: 'student', status: 'active' },
        { tenant_id: 'tenant-1', user_id: 'student-2', role: 'student', status: 'active' },
      ],
      parentLinks: [],
      courses: [],
      enrollments: [],
      assignments: [],
      submissions: [],
      grades: [],
      notifications: [],
      auditTrail: [],
      lessons: [],
      resources: [],
      resourceReviews: [],
      conversations: [],
      conversationMembers: [],
      messages: [],
      rubrics: [],
      attendance: [],
    })

    expect(records.actorIds.student).toBe('student-2')
  })
})
