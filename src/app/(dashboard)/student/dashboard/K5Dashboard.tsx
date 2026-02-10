'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun } from 'lucide-react';
import { PetStatusCard } from '@/components/dashboard/PetStatusCard';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { ClassCards } from '@/components/dashboard/ClassCards';
import { XPProgressBar } from '@/components/dashboard/XPProgressBar';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { createBrowserClient } from '@supabase/ssr';
import {
  mockPetData,
  mockXPData,
  mockAttendance,
  mockAttendanceStats,
} from '@/lib/mock-data';
import type {
  MockTask,
  MockClass,
  MockCalendarEvent,
  MockAttendanceDay,
} from '@/lib/mock-data';

interface K5DashboardProps {
  gradeLabel: string;
  firstName?: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function K5Dashboard({ gradeLabel, firstName: propFirstName }: K5DashboardProps) {
  const greeting = getGreeting();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const [studentName, setStudentName] = useState(propFirstName || '');
  const [tasks, setTasks] = useState<MockTask[]>([]);
  const [classes, setClasses] = useState<MockClass[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<MockCalendarEvent[]>([]);
  const [attendance, setAttendance] = useState<MockAttendanceDay[]>(mockAttendance);
  const [attendanceStats, setAttendanceStats] = useState(mockAttendanceStats);
  const [totalXP, setTotalXP] = useState(mockXPData.totalXP);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile name
        if (!propFirstName) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          if (profile?.first_name) setStudentName(profile.first_name);
        }

        // Fetch enrolled courses
        const { data: enrollments } = await supabase
          .from('course_enrollments')
          .select(`
            course_id,
            teacher_id,
            courses (
              id, name, subject, grade_level
            )
          `)
          .eq('student_id', user.id)
          .eq('status', 'active');

        if (enrollments && enrollments.length > 0) {
          const courseIds = enrollments.map((e) => (e.courses as any)?.id).filter(Boolean);

          // Get teacher profiles
          const teacherIds = [...new Set(enrollments.map((e) => e.teacher_id))];
          const { data: teacherProfiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', teacherIds);
          const teacherMap = new Map(
            (teacherProfiles || []).map((t) => [t.id, `${t.first_name || ''} ${t.last_name || ''}`.trim()])
          );

          // Get progress view
          const { data: progressData } = await supabase
            .from('student_course_progress')
            .select('*')
            .eq('student_id', user.id);
          const progressMap = new Map(
            (progressData || []).map((p) => [p.course_id, p])
          );

          // Build classes
          const subjectColors: Record<string, string> = {
            'Mathematics': '#3b82f6',
            'Science': '#10b981',
            'English Language Arts': '#8b5cf6',
            'English': '#8b5cf6',
            'History': '#f59e0b',
            'Art': '#ec4899',
          };
          const subjectEmojis: Record<string, string> = {
            'Mathematics': '\uD83D\uDCCF',
            'Science': '\uD83D\uDD2C',
            'English Language Arts': '\uD83D\uDCDA',
            'English': '\uD83D\uDCDA',
            'History': '\uD83C\uDF0D',
            'Art': '\uD83C\uDFA8',
          };

          const classData: MockClass[] = enrollments.map((e) => {
            const course = e.courses as any;
            const progress = progressMap.get(course?.id);
            return {
              id: course?.id || '',
              name: course?.name || '',
              teacherName: teacherMap.get(e.teacher_id) || 'Unknown',
              roomNumber: '',
              color: subjectColors[course?.subject || ''] || '#6366f1',
              iconEmoji: subjectEmojis[course?.subject || ''] || '\uD83D\uDCDA',
              schedule: '',
              nextAssignmentDue: '',
              studentCount: 0,
              averageGrade: progress?.average_grade || 0,
              recentActivity: '',
            };
          });
          setClasses(classData);

          // Fetch upcoming assignments as tasks
          const now = new Date();
          const { data: assignments } = await supabase
            .from('assignments')
            .select(`
              id, title, due_date, type, max_points, course_id,
              courses ( name, subject )
            `)
            .in('course_id', courseIds)
            .gte('due_date', new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString())
            .order('due_date', { ascending: true })
            .limit(10);

          // Check submissions
          const assignmentIds = (assignments || []).map((a) => a.id);
          const { data: submissions } = assignmentIds.length
            ? await supabase
                .from('submissions')
                .select('assignment_id')
                .eq('student_id', user.id)
                .in('assignment_id', assignmentIds)
            : { data: [] };
          const submittedSet = new Set((submissions || []).map((s) => s.assignment_id));

          const taskData: MockTask[] = (assignments || []).map((a) => {
            const course = a.courses as any;
            const dueDate = new Date(a.due_date);
            const diff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            let status: MockTask['status'] = 'upcoming';
            let dueDateLabel = dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            if (submittedSet.has(a.id)) {
              status = 'submitted';
            } else if (diff < 0) {
              status = 'overdue';
              dueDateLabel = 'Overdue';
            } else if (diff === 0) {
              status = 'due_soon';
              dueDateLabel = 'Today';
            } else if (diff === 1) {
              status = 'due_soon';
              dueDateLabel = 'Tomorrow';
            }

            return {
              id: a.id,
              title: a.title,
              courseName: course?.name || '',
              courseColor: subjectColors[course?.subject || ''] || '#6366f1',
              dueDate: a.due_date,
              dueDateLabel,
              status,
              pointsPossible: a.max_points || 100,
              xpReward: Math.round((a.max_points || 100) * 0.3),
              type: a.type || 'homework',
            };
          });
          setTasks(taskData);

          // Calendar events from assignments
          const { data: allAssignments } = await supabase
            .from('assignments')
            .select('id, title, due_date, type, course_id, courses ( name, subject )')
            .in('course_id', courseIds)
            .order('due_date', { ascending: true });

          const calEvents: MockCalendarEvent[] = (allAssignments || []).map((a) => {
            const course = a.courses as any;
            return {
              id: a.id,
              title: a.title,
              date: a.due_date ? a.due_date.split('T')[0] : '',
              type: a.type === 'quiz' || a.type === 'exam' ? 'quiz' : 'assignment',
              courseName: course?.name || '',
              courseColor: subjectColors[course?.subject || ''] || '#6366f1',
            };
          });
          setCalendarEvents(calEvents);

          // Attendance
          const { data: attendanceRecords } = await supabase
            .from('attendance_records')
            .select('attendance_date, status')
            .eq('student_id', user.id)
            .order('attendance_date', { ascending: false })
            .limit(5);

          if (attendanceRecords && attendanceRecords.length > 0) {
            const attDays: MockAttendanceDay[] = attendanceRecords.map((r) => ({
              date: r.attendance_date,
              dayLabel: new Date(r.attendance_date).toLocaleDateString('en-US', { weekday: 'short' }),
              status: (r.status === 'tardy' ? 'late' : r.status) as MockAttendanceDay['status'],
            }));
            setAttendance(attDays);
          }

          // Attendance stats
          const { data: allAttendance } = await supabase
            .from('attendance_records')
            .select('status')
            .eq('student_id', user.id);

          if (allAttendance && allAttendance.length > 0) {
            const total = allAttendance.length;
            const present = allAttendance.filter((r) => r.status === 'present' || r.status === 'online').length;
            const absent = allAttendance.filter((r) => r.status === 'absent').length;
            const late = allAttendance.filter((r) => r.status === 'tardy').length;
            const excused = allAttendance.filter((r) => r.status === 'excused').length;
            setAttendanceStats({
              totalDays: total,
              presentDays: present,
              absentDays: absent,
              lateDays: late,
              excusedDays: excused,
              attendanceRate: total > 0 ? Math.round((present / total) * 1000) / 10 : 100,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching K5 dashboard data:', error);
      }
    }

    fetchDashboardData();
  }, [propFirstName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 -m-4 md:-m-8 -mt-6 p-4 md:p-8 pt-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-4">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-2"
              >
                <Sun className="w-7 h-7 text-amber-400" />
                <span className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  {greeting}!
                </span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display">
                Hi, {studentName || 'Student'}!{' '}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block origin-bottom-right"
                >
                  &#x1F44B;
                </motion.span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentDate} &middot; {gradeLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-semibold text-gold-600 dark:text-gold-400">
                {/* TODO: XP/gamification tables don't exist yet - using mock XP for now */}
                {totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pet Status Card (Top, Large) */}
        {/* TODO: Pet system tables don't exist yet - keeping mock pet data */}
        <motion.div variants={itemVariants}>
          <PetStatusCard variant="k5" petData={mockPetData} xpData={mockXPData} />
        </motion.div>

        {/* Today's Tasks */}
        <motion.div variants={itemVariants}>
          <TasksCard variant="k5" tasks={tasks} />
        </motion.div>

        {/* Class Cards */}
        <motion.div variants={itemVariants}>
          <ClassCards variant="k5" classes={classes} />
        </motion.div>

        {/* XP / Level Bar */}
        {/* TODO: XP/gamification tables don't exist yet - keeping mock XP data */}
        <motion.div variants={itemVariants}>
          <XPProgressBar variant="k5" xpData={mockXPData} />
        </motion.div>

        {/* Attendance + Calendar Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceWidget variant="k5" attendance={attendance} stats={attendanceStats} />
          <CalendarWidget variant="k5" events={calendarEvents} />
        </motion.div>
      </motion.div>
    </div>
  );
}
