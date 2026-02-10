/**
 * Server-side Supabase queries for the Student dashboard pages.
 * These functions are designed to be called from Server Components or
 * from server-side data fetching in page.tsx files.
 */

import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { getUserTenantId } from '@/lib/auth';

// ─── Helpers ──────────────────────────────────────────────────────

async function getStudentContext() {
  const user = await requireAuth();
  const tenantId = await getUserTenantId();
  const supabase = await createClient();
  return { user, tenantId, supabase };
}

// ─── Profile ──────────────────────────────────────────────────────

export async function getStudentProfile() {
  const { user, tenantId, supabase } = await getStudentContext();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role, status, joined_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single();

  const { data: tenant } = tenantId
    ? await supabase
        .from('tenants')
        .select('name, slug')
        .eq('id', tenantId)
        .single()
    : { data: null };

  return {
    userId: user.id,
    email: user.email || '',
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    avatarUrl: profile?.avatar_url || null,
    phone: profile?.phone || null,
    dateOfBirth: profile?.date_of_birth || null,
    bio: profile?.bio || null,
    timezone: profile?.timezone || null,
    language: profile?.language || 'en',
    preferences: profile?.preferences || {},
    createdAt: profile?.created_at || '',
    role: membership?.role || 'student',
    joinedAt: membership?.joined_at || '',
    tenantId,
    tenantName: tenant?.name || '',
    tenantSlug: tenant?.slug || '',
  };
}

// ─── Courses ──────────────────────────────────────────────────────

export async function getStudentCourses() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get enrollments with course data and teacher profile
  const { data: enrollments, error } = await supabase
    .from('course_enrollments')
    .select(`
      id,
      status,
      grade_letter,
      grade_numeric,
      enrolled_at,
      course_id,
      teacher_id,
      courses (
        id,
        name,
        description,
        subject,
        grade_level,
        semester,
        start_date,
        end_date,
        status
      )
    `)
    .eq('student_id', user.id)
    .eq('status', 'active');

  if (error || !enrollments) return [];

  // Get teacher profiles for each enrollment
  const teacherIds = [...new Set(enrollments.map((e) => e.teacher_id))];
  const { data: teacherProfiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .in('id', teacherIds);

  const teacherMap = new Map(
    (teacherProfiles || []).map((t) => [t.id, t])
  );

  // Get progress data from the view
  const { data: progressData } = await supabase
    .from('student_course_progress')
    .select('*')
    .eq('student_id', user.id);

  const progressMap = new Map(
    (progressData || []).map((p) => [p.course_id, p])
  );

  // Get next upcoming assignment for each course
  const courseIds = enrollments
    .map((e) => (e.courses as any)?.id)
    .filter(Boolean);

  const { data: upcomingAssignments } = await supabase
    .from('assignments')
    .select('id, title, due_date, course_id')
    .in('course_id', courseIds)
    .gte('due_date', new Date().toISOString())
    .in('status', ['assigned', 'draft'])
    .order('due_date', { ascending: true });

  // Build a map of next assignment per course
  const nextAssignmentMap = new Map<string, { title: string; due_date: string }>();
  for (const a of upcomingAssignments || []) {
    if (!nextAssignmentMap.has(a.course_id)) {
      nextAssignmentMap.set(a.course_id, { title: a.title, due_date: a.due_date });
    }
  }

  return enrollments.map((enrollment) => {
    const course = enrollment.courses as any;
    const teacher = teacherMap.get(enrollment.teacher_id);
    const progress = progressMap.get(course?.id);
    const nextAssignment = nextAssignmentMap.get(course?.id);

    return {
      id: course?.id || '',
      name: course?.name || '',
      description: course?.description || '',
      subject: course?.subject || '',
      gradeLevel: course?.grade_level || '',
      semester: course?.semester || '',
      startDate: course?.start_date || '',
      endDate: course?.end_date || '',
      teacherName: teacher
        ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim()
        : 'Unknown Teacher',
      teacherAvatar: teacher?.avatar_url || null,
      enrollmentStatus: enrollment.status,
      gradeLetter: enrollment.grade_letter,
      gradeNumeric: enrollment.grade_numeric,
      completionPercentage: progress?.completion_percentage || 0,
      averageGrade: progress?.average_grade || null,
      totalAssignments: progress?.total_assignments || 0,
      gradedAssignments: progress?.graded_assignments || 0,
      nextAssignmentTitle: nextAssignment?.title || null,
      nextAssignmentDue: nextAssignment?.due_date || null,
    };
  });
}

// ─── Single Course Detail ─────────────────────────────────────────

export async function getStudentCourseDetail(courseId: string) {
  const { user, tenantId, supabase } = await getStudentContext();

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('course_id', courseId)
    .eq('student_id', user.id)
    .single();

  if (!enrollment) return null;

  // Get course with teacher
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (!course) return null;

  // Get teacher profile
  const { data: teacherProfile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', course.created_by)
    .single();

  // Get lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('status', 'published')
    .order('order_index', { ascending: true });

  // Get assignments
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('due_date', { ascending: true });

  // Get student's submissions for these assignments
  const assignmentIds = (assignments || []).map((a) => a.id);
  const { data: submissions } = assignmentIds.length
    ? await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds)
    : { data: [] };

  const submissionMap = new Map(
    (submissions || []).map((s) => [s.assignment_id, s])
  );

  // Get grades for this student in this course
  const { data: grades } = await supabase
    .from('grades')
    .select('*')
    .eq('student_id', user.id)
    .eq('course_id', courseId);

  const gradeMap = new Map(
    (grades || []).map((g) => [g.assignment_id, g])
  );

  // Get classmates
  const { data: classmateEnrollments } = await supabase
    .from('course_enrollments')
    .select('student_id')
    .eq('course_id', courseId)
    .eq('status', 'active')
    .neq('student_id', user.id);

  const classmateIds = (classmateEnrollments || []).map((e) => e.student_id);
  const { data: classmateProfiles } = classmateIds.length
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', classmateIds)
    : { data: [] };

  // Get announcements for this course
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('course_id', courseId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5);

  // Get progress from view
  const { data: progress } = await supabase
    .from('student_course_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .single();

  return {
    course: {
      ...course,
      teacherName: teacherProfile
        ? `${teacherProfile.first_name || ''} ${teacherProfile.last_name || ''}`.trim()
        : 'Unknown Teacher',
      teacherAvatar: teacherProfile?.avatar_url || null,
    },
    enrollment,
    lessons: lessons || [],
    assignments: (assignments || []).map((a) => ({
      ...a,
      submission: submissionMap.get(a.id) || null,
      grade: gradeMap.get(a.id) || null,
    })),
    classmates: (classmateProfiles || []).map((p) => ({
      id: p.id,
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      avatar: p.avatar_url,
    })),
    announcements: announcements || [],
    progress: {
      completionPercentage: progress?.completion_percentage || 0,
      averageGrade: progress?.average_grade || null,
      totalAssignments: progress?.total_assignments || 0,
      gradedAssignments: progress?.graded_assignments || 0,
    },
  };
}

// ─── Assignments ──────────────────────────────────────────────────

export async function getStudentAssignments() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get all courses the student is enrolled in
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', user.id)
    .eq('status', 'active');

  const courseIds = (enrollments || []).map((e) => e.course_id);
  if (courseIds.length === 0) return [];

  // Get all assignments for those courses
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      *,
      courses (
        id,
        name,
        subject,
        created_by
      )
    `)
    .in('course_id', courseIds)
    .order('due_date', { ascending: true });

  if (!assignments) return [];

  // Get submissions for these assignments
  const assignmentIds = assignments.map((a) => a.id);
  const { data: submissions } = assignmentIds.length
    ? await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds)
    : { data: [] };

  const submissionMap = new Map(
    (submissions || []).map((s) => [s.assignment_id, s])
  );

  // Get grades
  const { data: grades } = assignmentIds.length
    ? await supabase
        .from('grades')
        .select('*')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds)
    : { data: [] };

  const gradeMap = new Map(
    (grades || []).map((g) => [g.assignment_id, g])
  );

  // Get teacher profiles
  const teacherIds = [...new Set(assignments.map((a) => (a.courses as any)?.created_by).filter(Boolean))];
  const { data: teacherProfiles } = teacherIds.length
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', teacherIds)
    : { data: [] };

  const teacherMap = new Map(
    (teacherProfiles || []).map((t) => [t.id, `${t.first_name || ''} ${t.last_name || ''}`.trim()])
  );

  const now = new Date();

  return assignments.map((a) => {
    const course = a.courses as any;
    const submission = submissionMap.get(a.id);
    const grade = gradeMap.get(a.id);
    const dueDate = new Date(a.due_date);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let status: string;
    if (grade) {
      status = 'graded';
    } else if (submission) {
      status = 'submitted';
    } else if (daysUntilDue < 0) {
      status = 'overdue';
    } else if (daysUntilDue <= 2) {
      status = 'due_soon';
    } else {
      status = 'not_started';
    }

    return {
      id: a.id,
      title: a.title,
      description: a.description,
      instructions: a.instructions,
      type: a.type,
      submissionType: a.submission_type,
      courseName: course?.name || '',
      courseId: course?.id || '',
      teacherName: teacherMap.get(course?.created_by) || 'Unknown',
      dueDate: a.due_date,
      startDate: a.available_date,
      maxPoints: a.max_points,
      allowLateSubmission: a.allow_late_submission,
      status,
      daysUntilDue,
      submission: submission || null,
      grade: grade
        ? {
            pointsEarned: grade.points_earned,
            percentage: grade.percentage,
            letterGrade: grade.letter_grade,
            feedback: grade.feedback,
            gradedAt: grade.graded_at,
          }
        : null,
    };
  });
}

// ─── Grades ───────────────────────────────────────────────────────

export async function getStudentGrades() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get all enrollments with course info
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select(`
      course_id,
      grade_letter,
      grade_numeric,
      courses (
        id,
        name,
        subject,
        created_by
      )
    `)
    .eq('student_id', user.id)
    .eq('status', 'active');

  if (!enrollments || enrollments.length === 0) return { courses: [], overallAverage: 0 };

  const courseIds = enrollments.map((e) => e.course_id);

  // Get all grades for this student across enrolled courses
  const { data: grades } = await supabase
    .from('grades')
    .select(`
      *,
      assignments (
        id,
        title,
        type,
        max_points,
        due_date
      )
    `)
    .eq('student_id', user.id)
    .in('course_id', courseIds)
    .order('graded_at', { ascending: false });

  // Get teacher profiles
  const teacherIds = [...new Set(enrollments.map((e) => (e.courses as any)?.created_by).filter(Boolean))];
  const { data: teacherProfiles } = teacherIds.length
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', teacherIds)
    : { data: [] };

  const teacherMap = new Map(
    (teacherProfiles || []).map((t) => [t.id, `${t.first_name || ''} ${t.last_name || ''}`.trim()])
  );

  // Get total assignments per course
  const { data: allAssignments } = await supabase
    .from('assignments')
    .select('id, course_id')
    .in('course_id', courseIds);

  const assignmentCountMap = new Map<string, number>();
  for (const a of allAssignments || []) {
    assignmentCountMap.set(a.course_id, (assignmentCountMap.get(a.course_id) || 0) + 1);
  }

  // Group grades by course
  const gradesByCourse = new Map<string, any[]>();
  for (const grade of grades || []) {
    const list = gradesByCourse.get(grade.course_id) || [];
    list.push(grade);
    gradesByCourse.set(grade.course_id, list);
  }

  const courses = enrollments.map((enrollment) => {
    const course = enrollment.courses as any;
    const courseGrades = gradesByCourse.get(enrollment.course_id) || [];
    const totalAssignments = assignmentCountMap.get(enrollment.course_id) || 0;

    const avgPercentage =
      courseGrades.length > 0
        ? courseGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / courseGrades.length
        : 0;

    return {
      id: course?.id || '',
      className: course?.name || '',
      subject: course?.subject || '',
      teacher: teacherMap.get(course?.created_by) || 'Unknown',
      currentGrade: Math.round(avgPercentage),
      assignmentsDone: courseGrades.length,
      assignmentsTotal: totalAssignments,
      assignments: courseGrades.map((g) => ({
        id: g.id,
        name: (g.assignments as any)?.title || 'Unknown Assignment',
        type: (g.assignments as any)?.type || 'homework',
        score: g.points_earned || 0,
        total: (g.assignments as any)?.max_points || 100,
        percentage: g.percentage || 0,
        letterGrade: g.letter_grade || '',
        date: g.graded_at
          ? new Date(g.graded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : '',
        feedback: g.feedback || '',
        weight: (g.assignments as any)?.type || 'Assignment',
      })),
    };
  });

  const overallAverage =
    courses.length > 0
      ? Math.round(courses.reduce((sum, c) => sum + c.currentGrade, 0) / courses.length)
      : 0;

  return { courses, overallAverage };
}

// ─── Messages / Conversations ─────────────────────────────────────

export async function getStudentConversations() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get conversations this user is a member of
  const { data: memberships } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', user.id);

  const conversationIds = (memberships || []).map((m) => m.conversation_id);
  if (conversationIds.length === 0) return { conversations: [], messages: [] };

  // Get conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .in('id', conversationIds)
    .order('updated_at', { ascending: false });

  // For each conversation, get the last message and members
  const enrichedConversations = [];
  for (const conv of conversations || []) {
    // Get last message
    const { data: lastMessages } = await supabase
      .from('messages')
      .select('content, created_at, sender_id')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastMsg = lastMessages?.[0];

    // Get members
    const { data: members } = await supabase
      .from('conversation_members')
      .select('user_id')
      .eq('conversation_id', conv.id);

    const memberIds = (members || []).map((m) => m.user_id).filter((id) => id !== user.id);
    const { data: memberProfiles } = memberIds.length
      ? await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', memberIds)
      : { data: [] };

    // Get unread count
    const { data: allMsgs } = await supabase
      .from('messages')
      .select('id')
      .eq('conversation_id', conv.id)
      .neq('sender_id', user.id);

    const { data: readReceipts } = await supabase
      .from('message_read_receipts')
      .select('message_id')
      .eq('user_id', user.id)
      .in('message_id', (allMsgs || []).map((m) => m.id));

    const readMessageIds = new Set((readReceipts || []).map((r) => r.message_id));
    const unreadCount = (allMsgs || []).filter((m) => !readMessageIds.has(m.id)).length;

    // Determine display name
    let displayName = conv.subject || '';
    if (!displayName && memberProfiles && memberProfiles.length > 0) {
      displayName = memberProfiles
        .map((p) => `${p.first_name || ''} ${p.last_name || ''}`.trim())
        .join(', ');
    }
    if (!displayName) displayName = 'Conversation';

    enrichedConversations.push({
      id: conv.id,
      type: conv.type,
      subject: conv.subject,
      name: displayName,
      avatar: memberProfiles?.[0]?.avatar_url || null,
      lastMessage: lastMsg?.content || '',
      lastMessageAt: lastMsg?.created_at || conv.created_at,
      unreadCount,
      members: memberProfiles || [],
    });
  }

  return { conversations: enrichedConversations };
}

export async function getConversationMessages(conversationId: string) {
  const { user, supabase } = await getStudentContext();

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  // Get sender profiles
  const senderIds = [...new Set((messages || []).map((m) => m.sender_id))];
  const { data: senderProfiles } = senderIds.length
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', senderIds)
    : { data: [] };

  const senderMap = new Map(
    (senderProfiles || []).map((p) => [p.id, p])
  );

  return (messages || []).map((m) => {
    const sender = senderMap.get(m.sender_id);
    return {
      id: m.id,
      senderId: m.sender_id,
      senderName: sender
        ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim()
        : 'Unknown',
      senderAvatar: sender?.avatar_url || null,
      content: m.content,
      createdAt: m.created_at,
      isOwn: m.sender_id === user.id,
    };
  });
}

// ─── Calendar Events (from Assignments) ───────────────────────────

export async function getStudentCalendarEvents() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get enrolled course IDs
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', user.id)
    .eq('status', 'active');

  const courseIds = (enrollments || []).map((e) => e.course_id);
  if (courseIds.length === 0) return [];

  // Get assignments as calendar events
  const { data: assignments } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      due_date,
      type,
      status,
      course_id,
      courses (
        name,
        subject
      )
    `)
    .in('course_id', courseIds)
    .order('due_date', { ascending: true });

  // Get submissions to know status
  const assignmentIds = (assignments || []).map((a) => a.id);
  const { data: submissions } = assignmentIds.length
    ? await supabase
        .from('submissions')
        .select('assignment_id, status')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds)
    : { data: [] };

  const submissionMap = new Map(
    (submissions || []).map((s) => [s.assignment_id, s.status])
  );

  // Get grades
  const { data: grades } = assignmentIds.length
    ? await supabase
        .from('grades')
        .select('assignment_id')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds)
    : { data: [] };

  const gradedSet = new Set((grades || []).map((g) => g.assignment_id));

  return (assignments || []).map((a) => {
    const course = a.courses as any;
    let eventStatus: string | undefined;
    if (gradedSet.has(a.id)) {
      eventStatus = 'graded';
    } else if (submissionMap.has(a.id)) {
      eventStatus = 'submitted';
    } else {
      eventStatus = 'due';
    }

    return {
      id: a.id,
      title: a.title,
      date: a.due_date ? a.due_date.split('T')[0] : '',
      time: a.due_date
        ? new Date(a.due_date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })
        : undefined,
      type: a.type === 'quiz' || a.type === 'exam' ? 'assignment' : 'deadline',
      course: course?.name || '',
      courseSubject: course?.subject || '',
      status: eventStatus,
    };
  });
}

// ─── Dashboard Summary ────────────────────────────────────────────

export async function getStudentDashboardData() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get enrolled courses with teacher names
  const courses = await getStudentCourses();

  // Get upcoming assignments (next 7 days)
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', user.id)
    .eq('status', 'active');

  const courseIds = (enrollments || []).map((e) => e.course_id);

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: upcomingAssignments } = courseIds.length
    ? await supabase
        .from('assignments')
        .select(`
          id,
          title,
          due_date,
          type,
          max_points,
          course_id,
          courses (
            name
          )
        `)
        .in('course_id', courseIds)
        .gte('due_date', now.toISOString())
        .lte('due_date', nextWeek.toISOString())
        .order('due_date', { ascending: true })
    : { data: [] };

  // Get overdue assignments (past due, not submitted)
  const { data: pastDueAssignments } = courseIds.length
    ? await supabase
        .from('assignments')
        .select('id, title, due_date, course_id, courses ( name )')
        .in('course_id', courseIds)
        .lt('due_date', now.toISOString())
        .order('due_date', { ascending: false })
        .limit(10)
    : { data: [] };

  // Check which of the past-due have submissions
  const pastDueIds = (pastDueAssignments || []).map((a) => a.id);
  const { data: pastDueSubmissions } = pastDueIds.length
    ? await supabase
        .from('submissions')
        .select('assignment_id')
        .eq('student_id', user.id)
        .in('assignment_id', pastDueIds)
    : { data: [] };

  const submittedSet = new Set((pastDueSubmissions || []).map((s) => s.assignment_id));
  const overdueAssignments = (pastDueAssignments || []).filter(
    (a) => !submittedSet.has(a.id)
  );

  // Get recent grades
  const { data: recentGrades } = courseIds.length
    ? await supabase
        .from('grades')
        .select(`
          id,
          points_earned,
          percentage,
          letter_grade,
          graded_at,
          course_id,
          assignments (
            title,
            max_points
          ),
          courses (
            name
          )
        `)
        .eq('student_id', user.id)
        .in('course_id', courseIds)
        .order('graded_at', { ascending: false })
        .limit(5)
    : { data: [] };

  // Get unread message count
  const { data: convMemberships } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', user.id);

  let unreadMessageCount = 0;
  if (convMemberships && convMemberships.length > 0) {
    const convIds = convMemberships.map((m) => m.conversation_id);
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id')
      .in('conversation_id', convIds)
      .neq('sender_id', user.id);

    // Simplified count - not checking read receipts for performance
    unreadMessageCount = (unreadMessages || []).length;
  }

  // Get attendance stats
  const { data: attendanceRecords } = courseIds.length
    ? await supabase
        .from('attendance_records')
        .select('status')
        .eq('student_id', user.id)
    : { data: [] };

  const attendanceStats = {
    total: (attendanceRecords || []).length,
    present: (attendanceRecords || []).filter((r) => r.status === 'present').length,
    absent: (attendanceRecords || []).filter((r) => r.status === 'absent').length,
    tardy: (attendanceRecords || []).filter((r) => r.status === 'tardy').length,
    rate:
      (attendanceRecords || []).length > 0
        ? Math.round(
            ((attendanceRecords || []).filter((r) => r.status === 'present' || r.status === 'online').length /
              (attendanceRecords || []).length) *
              100
          )
        : 100,
  };

  return {
    profile: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      avatarUrl: profile?.avatar_url || null,
    },
    courses,
    upcomingAssignments: (upcomingAssignments || []).map((a) => ({
      id: a.id,
      title: a.title,
      dueDate: a.due_date,
      type: a.type,
      maxPoints: a.max_points,
      courseName: (a.courses as any)?.name || '',
    })),
    overdueAssignments: overdueAssignments.map((a) => ({
      id: a.id,
      title: a.title,
      dueDate: a.due_date,
      courseName: (a.courses as any)?.name || '',
    })),
    recentGrades: (recentGrades || []).map((g) => ({
      id: g.id,
      assignmentTitle: (g.assignments as any)?.title || '',
      courseName: (g.courses as any)?.name || '',
      pointsEarned: g.points_earned,
      maxPoints: (g.assignments as any)?.max_points || 100,
      percentage: g.percentage,
      letterGrade: g.letter_grade,
      gradedAt: g.graded_at,
    })),
    unreadMessageCount,
    attendanceStats,
    courseCount: courses.length,
  };
}

// ─── Gamification / XP / Achievements ──────────────────────────────

export async function getStudentGamificationData() {
  const { user, tenantId, supabase } = await getStudentContext();

  // Get XP data
  const { data: xpData } = await supabase
    .from('student_xp')
    .select('*')
    .eq('student_id', user.id)
    .limit(1)
    .single();

  // Get achievements
  const { data: achievements } = await supabase
    .from('student_achievements')
    .select('*')
    .eq('student_id', user.id)
    .order('unlocked_at', { ascending: false });

  // Get recent XP transactions
  const { data: xpTransactions } = await supabase
    .from('xp_transactions')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return {
    xp: xpData
      ? {
          totalXP: xpData.total_xp || 0,
          currentLevel: xpData.current_level || 1,
          currentTier: xpData.current_tier || 'Novice',
          streakDays: xpData.streak_days || 0,
          coins: xpData.coins || 0,
          lastLoginDate: xpData.last_login_date || null,
        }
      : null,
    achievements: (achievements || []).map((a) => ({
      id: a.id,
      achievementId: a.achievement_id,
      unlockedAt: a.unlocked_at,
      displayed: a.displayed,
    })),
    xpTransactions: (xpTransactions || []).map((t) => ({
      id: t.id,
      amount: t.amount,
      sourceType: t.source_type,
      description: t.description,
      createdAt: t.created_at,
    })),
  };
}

// ─── Notifications ────────────────────────────────────────────────

export async function getStudentNotifications(limit = 20) {
  const { user, supabase } = await getStudentContext();

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  return notifications || [];
}
