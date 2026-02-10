'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | null;

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  present: {
    label: 'Present',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-500/20 hover:bg-green-500/30',
    icon: CheckCircle,
  },
  absent: {
    label: 'Absent',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-500/20 hover:bg-red-500/30',
    icon: XCircle,
  },
  tardy: {
    label: 'Tardy',
    color: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-500/20 hover:bg-yellow-500/30',
    icon: Clock,
  },
  excused: {
    label: 'Excused',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-500/20 hover:bg-blue-500/30',
    icon: AlertCircle,
  },
};

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  attendanceRate: number;
}

interface WeekDay {
  date: string;
  day: string;
  present: number;
  absent: number;
  tardy: number;
  excused: number;
  rate: number;
}

interface CourseData {
  id: string;
  name: string;
  gradeLevel: string;
  studentCount: number;
  students: StudentData[];
  weekSummary: WeekDay[];
  todayRecords: Record<string, { status: string; notes: string }>;
}

interface TeacherAttendanceClientProps {
  courses: CourseData[];
  teacherId: string;
  tenantId: string;
}

export function TeacherAttendanceClient({ courses, teacherId, tenantId }: TeacherAttendanceClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    if (courses.length === 0) return {};
    const course = courses[0];
    const initial: Record<string, AttendanceStatus> = {};
    course.students.forEach((s) => {
      const existing = course.todayRecords[s.id];
      initial[s.id] = existing ? (existing.status as AttendanceStatus) : null;
    });
    return initial;
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsSaved(false);
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    const initial: Record<string, AttendanceStatus> = {};
    course.students.forEach((s) => {
      const existing = course.todayRecords[s.id];
      initial[s.id] = existing ? (existing.status as AttendanceStatus) : null;
    });
    setAttendance(initial);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setIsSaved(false);
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }));
  };

  const handleMarkAllPresent = () => {
    if (!selectedCourse) return;
    setIsSaved(false);
    const allPresent: Record<string, AttendanceStatus> = {};
    selectedCourse.students.forEach((s) => {
      allPresent[s.id] = 'present';
    });
    setAttendance(allPresent);
  };

  const handleSave = useCallback(async () => {
    if (!selectedCourse) return;
    setIsSaving(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const records = Object.entries(attendance)
        .filter(([_, status]) => status !== null)
        .map(([studentId, status]) => ({
          studentId,
          status,
          notes: '',
        }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedCourseId,
          recordDate: today,
          attendance: records,
        }),
      });

      if (res.ok) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setIsSaving(false);
    }
  }, [attendance, selectedCourse, selectedCourseId]);

  if (courses.length === 0 || !selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Attendance
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No courses found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Summary counts
  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
  const tardyCount = Object.values(attendance).filter((s) => s === 'tardy').length;
  const excusedCount = Object.values(attendance).filter((s) => s === 'excused').length;
  const unmarkedCount = Object.values(attendance).filter((s) => s === null).length;

  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Attendance
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track daily attendance for your classes
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleMarkAllPresent}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Present
            </Button>
            <Button
              className={cn(
                'text-white',
                isSaved
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              )}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Attendance'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Course Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseChange(course.id)}
              className={cn(
                'flex-shrink-0 p-4 rounded-xl border-2 transition-all duration-200 text-left min-w-[200px]',
                selectedCourseId === course.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 hover:border-indigo-300'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {course.name}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{course.studentCount} students</span>
              </div>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{presentCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Present</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{absentCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{tardyCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tardy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{excusedCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Excused</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{unmarkedCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unmarked</p>
            </CardContent>
          </Card>
        </div>

        {/* Take Attendance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Take Attendance - {selectedCourse.name}
              </CardTitle>
              <Badge className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                Today: {todayFormatted}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCourse.students.map((student) => {
              const currentStatus = attendance[student.id];
              return (
                <div
                  key={student.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-all',
                    currentStatus === 'present' && 'bg-green-50 dark:bg-green-900/10',
                    currentStatus === 'absent' && 'bg-red-50 dark:bg-red-900/10',
                    currentStatus === 'tardy' && 'bg-yellow-50 dark:bg-yellow-900/10',
                    currentStatus === 'excused' && 'bg-blue-50 dark:bg-blue-900/10',
                    !currentStatus && 'bg-slate-50 dark:bg-slate-800/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Overall: {student.attendanceRate}% attendance
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[string]][]).map(
                      ([status, config]) => {
                        const Icon = config.icon;
                        const isActive = currentStatus === status;
                        return (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(student.id, status as AttendanceStatus)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                              isActive
                                ? cn(config.bgColor, config.color, 'border-current')
                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                            )}
                            title={config.label}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">{config.label}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Weekly Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {selectedCourse.weekSummary.map((day) => (
                <div key={day.date} className="text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {day.day}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-sm',
                      day.rate >= 95
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : day.rate >= 85
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    )}
                  >
                    {day.rate}%
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>P: {day.present}</span>
                      <span>A: {day.absent}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>T: {day.tardy}</span>
                      <span>E: {day.excused}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Attendance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedCourse.students
              .filter((s) => s.attendanceRate < 90)
              .sort((a, b) => a.attendanceRate - b.attendanceRate)
              .map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-orange-700 dark:text-orange-300 text-xs font-medium">
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Attendance below 90% threshold
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={cn(
                          'font-bold text-sm',
                          student.attendanceRate < 85
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-orange-600 dark:text-orange-400'
                        )}
                      >
                        {student.attendanceRate}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">attendance</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}

            {selectedCourse.students.filter((s) => s.attendanceRate < 90).length === 0 && (
              <div className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  All students are above the 90% attendance threshold
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
