import { getStudentAssignments } from '@/lib/queries/student';
import { AssignmentsPageClient } from './AssignmentsPageClient';
import type { MockAssignment, AssignmentStatus, AssignmentKind, SubmissionType } from '@/lib/mock-data';

/**
 * Maps the real Supabase assignment data from getStudentAssignments()
 * into the MockAssignment shape expected by AssignmentCard / AssignmentRow.
 */
function mapToMockAssignment(a: Awaited<ReturnType<typeof getStudentAssignments>>[number]): MockAssignment {
  // Map the computed status string to the AssignmentStatus union
  const statusMap: Record<string, AssignmentStatus> = {
    graded: 'graded',
    submitted: 'submitted',
    overdue: 'overdue',
    due_soon: 'due_soon',
    not_started: 'not_started',
    in_progress: 'in_progress',
  };

  const typeMap: Record<string, AssignmentKind> = {
    homework: 'homework',
    quiz: 'quiz',
    project: 'project',
    exam: 'exam',
    discussion: 'discussion',
  };

  const submissionTypeMap: Record<string, SubmissionType> = {
    text_entry: 'text',
    file_upload: 'file',
    external_url: 'link',
    discussion: 'discussion',
  };

  return {
    id: a.id,
    title: a.title,
    description: a.description || '',
    instructions: a.instructions || '',
    type: typeMap[a.type] || 'homework',
    submissionType: submissionTypeMap[a.submissionType] || 'text',
    courseName: a.courseName,
    courseColor: '#6366f1', // Default indigo; real color not stored in DB
    courseId: a.courseId,
    teacherName: a.teacherName,
    dueDate: a.dueDate,
    startDate: a.startDate || a.dueDate,
    maxPoints: a.maxPoints,
    xpReward: 0,
    allowLateSubmission: a.allowLateSubmission ?? false,
    latePenaltyPercent: 0,
    status: statusMap[a.status] || 'not_started',
    submission: a.submission
      ? {
          id: a.submission.id,
          submittedAt: a.submission.submitted_at || '',
          submittedLate: false,
          submissionText: a.submission.content || undefined,
          fileName: a.submission.file_name || undefined,
          filePath: a.submission.file_url || undefined,
          status: a.submission.status || 'submitted',
        }
      : undefined,
    grade: a.grade
      ? {
          id: `grade-${a.id}`,
          pointsEarned: a.grade.pointsEarned || 0,
          percentage: a.grade.percentage || 0,
          letterGrade: a.grade.letterGrade || '',
          feedback: a.grade.feedback || '',
          gradedAt: a.grade.gradedAt || '',
        }
      : undefined,
  };
}

export default async function AssignmentsPage() {
  const assignments = await getStudentAssignments();
  const mappedAssignments = assignments.map(mapToMockAssignment);

  return <AssignmentsPageClient assignments={mappedAssignments} />;
}
