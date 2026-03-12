'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'

interface GradeData {
  grade: string
  textbook: string
  chapters: number
  outcomes: string[]
}

interface SubjectData {
  subject: string
  color: string
  grades: GradeData[]
}

const curriculumData: SubjectData[] = [
  {
    subject: 'Mathematics',
    color: '#8B5CF6',
    grades: [
      { grade: 'K', textbook: 'WolfWhale Math K', chapters: 4, outcomes: ['NK.1', 'NK.2', 'NK.3', 'NK.4', 'NK.5', 'PK.1', 'PK.2', 'SSK.1', 'SSK.2'] },
      { grade: '1', textbook: 'WolfWhale Math 1', chapters: 4, outcomes: ['N1.1', 'N1.2', 'N1.3', 'N1.4', 'N1.5', 'N1.6', 'N1.7', 'N1.8', 'N1.9', 'N1.10', 'P1.1', 'P1.2', 'P1.3', 'P1.4', 'SS1.1', 'SS1.2', 'SS1.3', 'SS1.4'] },
      { grade: '2', textbook: 'WolfWhale Math 2', chapters: 4, outcomes: ['N2.1', 'N2.2', 'N2.3', 'N2.4', 'N2.5', 'N2.6', 'N2.7', 'N2.8', 'N2.9', 'P2.1', 'P2.2', 'P2.3', 'SS2.1', 'SS2.2', 'SS2.3', 'SS2.4', 'SP2.1'] },
      { grade: '3', textbook: 'WolfWhale Math 3', chapters: 4, outcomes: ['N3.1', 'N3.2', 'N3.3', 'N3.4', 'P3.1', 'P3.2', 'SS3.1', 'SS3.2', 'SS3.3', 'SS3.4', 'SS3.5', 'SP3.1'] },
      { grade: '4', textbook: 'WolfWhale Math 4', chapters: 4, outcomes: ['N4.1', 'N4.2', 'N4.3', 'N4.4', 'N4.5', 'N4.6', 'N4.7', 'N4.8', 'P4.1', 'P4.2', 'SS4.1', 'SS4.2', 'SS4.3', 'SS4.4', 'SP4.1'] },
      { grade: '5', textbook: 'WolfWhale Math 5', chapters: 4, outcomes: ['N5.1', 'N5.2', 'N5.3', 'N5.4', 'N5.5', 'N5.6', 'N5.7', 'P5.1', 'P5.2', 'SS5.1', 'SS5.2', 'SS5.3', 'SS5.4', 'SS5.5', 'SS5.6', 'SS5.7', 'SP5.1', 'SP5.2', 'SP5.3'] },
      { grade: '6', textbook: 'WolfWhale Math 6', chapters: 4, outcomes: ['N6.1', 'N6.2', 'N6.3', 'N6.4', 'N6.5', 'N6.6', 'N6.7', 'N6.8', 'N6.9', 'P6.1', 'P6.2', 'P6.3', 'SS6.1', 'SS6.2', 'SS6.3', 'SS6.4', 'SS6.5', 'SP6.1', 'SP6.2'] },
      { grade: '7', textbook: 'WolfWhale Math 7', chapters: 4, outcomes: ['N7.1', 'N7.2', 'N7.3', 'N7.4', 'N7.5', 'N7.6', 'P7.1', 'P7.2', 'P7.3', 'P7.4', 'SS7.1', 'SS7.2', 'SS7.3', 'SS7.4', 'SS7.5', 'SP7.1', 'SP7.2', 'SP7.3'] },
      { grade: '8', textbook: 'WolfWhale Math 8', chapters: 4, outcomes: ['N8.1', 'N8.2', 'N8.3', 'N8.4', 'N8.5', 'P8.1', 'P8.2', 'SS8.1', 'SS8.2', 'SS8.3', 'SS8.4', 'SP8.1', 'SP8.2'] },
      { grade: '9', textbook: 'WolfWhale Math 9', chapters: 4, outcomes: ['N9.1', 'N9.2', 'N9.3', 'P9.1', 'P9.2', 'P9.3', 'P9.4', 'SS9.1', 'SS9.2', 'SS9.3', 'SS9.4', 'SP9.1', 'SP9.2', 'SP9.3', 'SP9.4'] },
      { grade: '10', textbook: 'WolfWhale Math 10', chapters: 4, outcomes: ['FP10.1', 'FP10.2', 'FP10.3', 'FP10.4', 'FP10.5', 'FP10.6', 'FP10.7', 'FP10.8', 'FP10.9', 'FP10.10'] },
      { grade: '20', textbook: 'WolfWhale Math 20', chapters: 4, outcomes: ['P20.1', 'P20.2', 'P20.3', 'P20.4', 'P20.5', 'P20.6', 'P20.7', 'P20.8', 'P20.9', 'P20.10', 'P20.11'] },
      { grade: 'FM20', textbook: 'WolfWhale Foundations Math 20', chapters: 4, outcomes: ['FM20.1', 'FM20.2', 'FM20.3', 'FM20.4', 'FM20.5', 'FM20.6', 'FM20.7', 'FM20.8', 'FM20.9'] },
      { grade: '30', textbook: 'WolfWhale Math 30', chapters: 4, outcomes: ['P30.1', 'P30.2', 'P30.3', 'P30.4', 'P30.5', 'P30.6', 'P30.7', 'P30.8', 'P30.9', 'P30.10', 'P30.11', 'P30.12', 'P30.13'] },
    ],
  },
  {
    subject: 'English Language Arts',
    color: '#00BFFF',
    grades: [
      { grade: 'K', textbook: 'WolfWhale ELA K', chapters: 4, outcomes: ['CRK.1', 'CCK.1', 'CCK.2', 'CCK.3', 'CCK.4', 'ARK.1'] },
      { grade: '1', textbook: 'WolfWhale ELA 1', chapters: 4, outcomes: ['CR1.1', 'CR1.2', 'CR1.3', 'CR1.4', 'CC1.1', 'CC1.2', 'CC1.3', 'CC1.4', 'AR1.1', 'AR1.2'] },
      { grade: '2', textbook: 'WolfWhale ELA 2', chapters: 4, outcomes: ['CR2.1', 'CR2.2', 'CR2.3', 'CR2.4', 'CC2.1', 'CC2.2', 'CC2.3', 'CC2.4', 'AR2.1', 'AR2.2'] },
      { grade: '3', textbook: 'WolfWhale ELA 3', chapters: 4, outcomes: ['CR3.1', 'CR3.2', 'CR3.3', 'CR3.4', 'CC3.1', 'CC3.2', 'CC3.3', 'CC3.4', 'AR3.1', 'AR3.2'] },
      { grade: '4', textbook: 'WolfWhale ELA 4', chapters: 4, outcomes: ['CR4.1', 'CR4.2', 'CR4.3', 'CR4.4', 'CC4.1', 'CC4.2', 'CC4.3', 'CC4.4', 'AR4.1', 'AR4.2'] },
      { grade: '6', textbook: 'WolfWhale ELA 6', chapters: 4, outcomes: ['CR6.1', 'CR6.2', 'CR6.3', 'CR6.4', 'CR6.5', 'CR6.6', 'CR6.7', 'CR6.8', 'CC6.1', 'CC6.2', 'CC6.3', 'CC6.4', 'CC6.5', 'CC6.6', 'CC6.7', 'CC6.8', 'CC6.9', 'AR6.1', 'AR6.2', 'AR6.3'] },
      { grade: '7', textbook: 'WolfWhale ELA 7', chapters: 4, outcomes: ['CR7.1', 'CR7.2', 'CR7.3', 'CR7.4', 'CR7.5', 'CR7.6', 'CR7.7', 'CR7.8', 'CC7.1', 'CC7.2', 'CC7.3', 'CC7.4', 'CC7.5', 'CC7.6', 'CC7.7', 'CC7.8', 'CC7.9', 'AR7.1', 'AR7.2'] },
      { grade: '9', textbook: 'WolfWhale ELA 9', chapters: 4, outcomes: ['CR9.1a', 'CR9.1b', 'CR9.2a', 'CR9.2b', 'CR9.3a', 'CR9.3b', 'CR9.4a', 'CR9.4b', 'CR9.5a', 'CR9.5b', 'CR9.6a', 'CR9.6b', 'CR9.7a', 'CR9.7b', 'CR9.8a', 'CR9.8b', 'CC9.1a', 'CC9.1b', 'CC9.2a', 'CC9.2b', 'CC9.3a', 'CC9.3b', 'CC9.4a', 'CC9.4b', 'CC9.5a', 'CC9.5b', 'CC9.6a', 'CC9.6b', 'CC9.7a', 'CC9.7b', 'CC9.8a', 'CC9.8b', 'CC9.9a', 'CC9.9b', 'AR9.1a', 'AR9.1b', 'AR9.2a', 'AR9.2b'] },
      { grade: '20', textbook: 'WolfWhale ELA 20', chapters: 4, outcomes: ['CR20.1', 'CR20.2', 'CR20.3', 'CR20.4', 'CC20.1', 'CC20.2', 'CC20.3', 'CC20.4', 'AR20.1', 'AR20.2'] },
      { grade: '30', textbook: 'WolfWhale ELA 30', chapters: 4, outcomes: ['CRA30.1', 'CRA30.2', 'CRA30.3', 'CRA30.4', 'CCA30.1', 'CCA30.2', 'CCA30.3', 'CCA30.4', 'ARA30.1', 'ARA30.2', 'CRB30.1', 'CRB30.2', 'CRB30.3', 'CRB30.4', 'CCB30.1', 'CCB30.2', 'CCB30.3', 'CCB30.4', 'ARB30.1', 'ARB30.2'] },
    ],
  },
  {
    subject: 'Science',
    color: '#10B981',
    grades: [
      { grade: 'K', textbook: 'WolfWhale Science K', chapters: 4, outcomes: ['LTK.1', 'OMK.1', 'SEK.1', 'DSK.1'] },
      { grade: '1', textbook: 'WolfWhale Science 1', chapters: 4, outcomes: ['LT1.1', 'LT1.2', 'OM1.1', 'OM1.2', 'SE1.1', 'SE1.2', 'DS1.1', 'DS1.2'] },
      { grade: '2', textbook: 'WolfWhale Science 2', chapters: 4, outcomes: ['AN2.1', 'AN2.2', 'LI2.1', 'LI2.2', 'AW2.1', 'AW2.2', 'AP2.1', 'AP2.2'] },
      { grade: '3', textbook: 'WolfWhale Science 3', chapters: 4, outcomes: ['PL3.1', 'PL3.2', 'SM3.1', 'SM3.2', 'ME3.1', 'ME3.2', 'ES3.1', 'ES3.2'] },
      { grade: '4', textbook: 'WolfWhale Science 4', chapters: 4, outcomes: ['HC4.1', 'HC4.2', 'HC4.3', 'LI4.1', 'LI4.2', 'LI4.3', 'SO4.1', 'SO4.2', 'SO4.3', 'RM4.1', 'RM4.2', 'RM4.3'] },
      { grade: '5', textbook: 'WolfWhale Science 5', chapters: 4, outcomes: ['HB5.1', 'HB5.2', 'HB5.3', 'MC5.1', 'MC5.2', 'MC5.3', 'FM5.1', 'FM5.2', 'FM5.3', 'WE5.1', 'WE5.2', 'WE5.3'] },
      { grade: '6', textbook: 'WolfWhale Science 6', chapters: 4, outcomes: ['DL6.1', 'DL6.2', 'DL6.3', 'DL6.4', 'DL6.5', 'EL6.1', 'EL6.2', 'EL6.3', 'FL6.1', 'FL6.2', 'FL6.3', 'SS6.1', 'SS6.2', 'SS6.3'] },
      { grade: '7', textbook: 'WolfWhale Science 7', chapters: 4, outcomes: ['IE7.1', 'IE7.2', 'IE7.3', 'IE7.4', 'MS7.1', 'MS7.2', 'MS7.3', 'HT7.1', 'HT7.2', 'HT7.3', 'EC7.1', 'EC7.2', 'EC7.3'] },
      { grade: '8', textbook: 'WolfWhale Science 8', chapters: 4, outcomes: ['CS8.1', 'CS8.2', 'CS8.3', 'CS8.4', 'OP8.1', 'OP8.2', 'OP8.3', 'OP8.4', 'FD8.1', 'FD8.2', 'FD8.3', 'FD8.4', 'WS8.1', 'WS8.2', 'WS8.3'] },
      { grade: '10', textbook: 'WolfWhale Science 10', chapters: 4, outcomes: ['SCI10-CI1', 'SCI10-CD1', 'SCI10-CD2', 'SCI10-CD3', 'SCI10-CD4', 'SCI10-CR1', 'SCI10-CR2', 'SCI10-CR3', 'SCI10-CR4', 'SCI10-FM1', 'SCI10-FM2', 'SCI10-FM3', 'SCI10-FM4'] },
      { grade: 'Physics 20', textbook: 'WolfWhale Physics 20', chapters: 4, outcomes: ['P20-KI1', 'P20-KI2', 'P20-KI3', 'P20-FM1', 'P20-FM2', 'P20-FM3', 'P20-WM1', 'P20-WM2', 'P20-WM3'] },
      { grade: 'Physics 30', textbook: 'WolfWhale Physics 30', chapters: 4, outcomes: ['P30-FM1', 'P30-FM2', 'P30-FM3', 'P30-EM1', 'P30-EM2', 'P30-EM3', 'P30-MP1', 'P30-MP2', 'P30-MP3'] },
      { grade: 'Biology 30', textbook: 'WolfWhale Biology 30', chapters: 4, outcomes: ['B30-BC1', 'B30-BC2', 'B30-BC3', 'B30-MC1', 'B30-MC2', 'B30-MC3', 'B30-GE1', 'B30-GE2', 'B30-GE3', 'B30-PH1', 'B30-PH2', 'B30-PH3'] },
      { grade: 'Chemistry 30', textbook: 'WolfWhale Chemistry 30', chapters: 4, outcomes: ['C30-TT1', 'C30-TT2', 'C30-TT3', 'C30-EQ1', 'C30-EQ2', 'C30-EQ3', 'C30-AB1', 'C30-AB2', 'C30-AB3', 'C30-EC1', 'C30-EC2', 'C30-EC3'] },
    ],
  },
  {
    subject: 'Social Studies',
    color: '#F59E0B',
    grades: [
      { grade: 'K', textbook: 'WolfWhale Social Studies K', chapters: 4, outcomes: ['INK.1', 'INK.2', 'DRK.1', 'DRK.2', 'PAK.1', 'RWK.1'] },
      { grade: '1', textbook: 'WolfWhale Social Studies 1', chapters: 4, outcomes: ['IN1.1', 'IN1.2', 'IN1.3', 'DR1.1', 'DR1.2', 'DR1.3', 'DR1.4', 'PA1.1', 'PA1.2', 'RW1.1', 'RW1.2'] },
      { grade: '2', textbook: 'WolfWhale Social Studies 2', chapters: 4, outcomes: ['IN2.1', 'IN2.2', 'DR2.1', 'DR2.2', 'DR2.3', 'DR2.4', 'PA2.1', 'PA2.2', 'PA2.3', 'RW2.1'] },
      { grade: '3', textbook: 'WolfWhale Social Studies 3', chapters: 4, outcomes: ['IN3.1', 'IN3.2', 'IN3.3', 'DR3.1', 'DR3.2', 'DR3.3', 'PA3.1', 'PA3.2', 'PA3.3', 'RW3.1', 'RW3.2', 'RW3.3'] },
      { grade: '5', textbook: 'WolfWhale Social Studies 5', chapters: 4, outcomes: ['IN5.1', 'IN5.2', 'DR5.1', 'DR5.2', 'DR5.3', 'PA5.1', 'PA5.2', 'PA5.3', 'RW5.1', 'RW5.2'] },
      { grade: '6', textbook: 'WolfWhale Social Studies 6', chapters: 4, outcomes: ['IN6.1', 'IN6.2', 'IN6.3', 'IN6.4', 'DR6.1', 'DR6.2', 'DR6.3', 'DR6.4', 'PA6.1', 'PA6.2', 'PA6.3', 'RW6.1', 'RW6.2'] },
      { grade: '8', textbook: 'WolfWhale Social Studies 8', chapters: 4, outcomes: ['IN8.1', 'IN8.2', 'DR8.1', 'DR8.2', 'DR8.3', 'PA8.1', 'PA8.2', 'PA8.3', 'PA8.4', 'RW8.1', 'RW8.2', 'RW8.3'] },
      { grade: '9', textbook: 'WolfWhale Social Studies 9', chapters: 4, outcomes: ['IN9.1', 'IN9.2', 'IN9.3', 'IN9.4', 'DR9.1', 'DR9.2', 'DR9.3', 'DR9.4', 'PA9.1', 'PA9.2', 'PA9.3', 'RW9.1', 'RW9.2', 'RW9.3'] },
    ],
  },
  {
    subject: 'Health Education',
    color: '#EF4444',
    grades: [
      { grade: '1', textbook: 'WolfWhale Health 1', chapters: 4, outcomes: ['USC1.1', 'USC1.2', 'USC1.3', 'USC1.4', 'USC1.5', 'USC1.6', 'DM1.1', 'AP1.1'] },
      { grade: '3', textbook: 'WolfWhale Health 3', chapters: 4, outcomes: ['USC3.1', 'USC3.2', 'USC3.3', 'USC3.4', 'USC3.5', 'USC3.6', 'DM3.1', 'AP3.1'] },
      { grade: '4', textbook: 'WolfWhale Health 4', chapters: 4, outcomes: ['USC4.1', 'USC4.2', 'USC4.3', 'USC4.4', 'USC4.5', 'USC4.6', 'DM4.1', 'AP4.1'] },
      { grade: '6', textbook: 'WolfWhale Health 6', chapters: 4, outcomes: ['USC6.1', 'USC6.2', 'USC6.3', 'USC6.4', 'USC6.5', 'USC6.6', 'USC6.7', 'DM6.8', 'DM6.9', 'AP6.10'] },
      { grade: '7', textbook: 'WolfWhale Health 7', chapters: 4, outcomes: ['USC7.1', 'USC7.2', 'USC7.3', 'USC7.4', 'USC7.5', 'USC7.6', 'USC7.7', 'DM7.8', 'DM7.9', 'AP7.10'] },
      { grade: '9', textbook: 'WolfWhale Health 9', chapters: 4, outcomes: ['USC9.1', 'USC9.2', 'USC9.3', 'USC9.4', 'USC9.5', 'USC9.6', 'USC9.7', 'USC9.8', 'USC9.9', 'DM9.10', 'DM9.11', 'AP9.12'] },
    ],
  },
  {
    subject: 'Arts Education',
    color: '#EC4899',
    grades: [
      { grade: '1', textbook: 'WolfWhale Arts 1', chapters: 4, outcomes: ['CP1.1', 'CP1.2', 'CP1.3', 'CP1.4', 'CP1.5', 'CP1.6', 'CP1.7', 'CP1.8', 'CR1.1', 'CR1.2', 'CH1.1', 'CH1.2'] },
      { grade: '4', textbook: 'WolfWhale Arts 4', chapters: 4, outcomes: ['CP4.1', 'CP4.2', 'CP4.3', 'CP4.4', 'CP4.5', 'CP4.6', 'CP4.7', 'CP4.8', 'CR4.1', 'CR4.2', 'CH4.1', 'CH4.2'] },
      { grade: '7', textbook: 'WolfWhale Arts 7', chapters: 4, outcomes: ['CP7.1', 'CP7.2', 'CP7.3', 'CP7.4', 'CP7.5', 'CP7.6', 'CP7.7', 'CP7.8', 'CP7.9', 'CP7.10', 'CP7.11', 'CP7.12', 'CR7.1', 'CR7.2', 'CR7.3', 'CH7.1', 'CH7.2', 'CH7.3'] },
    ],
  },
  {
    subject: 'Physical Education',
    color: '#06B6D4',
    grades: [
      { grade: '1', textbook: 'WolfWhale PE 1', chapters: 4, outcomes: ['PE1.1', 'PE1.2', 'PE1.3', 'PE1.4', 'PE1.5', 'PE1.6', 'PE1.7', 'PE1.8', 'PE1.9'] },
      { grade: '4', textbook: 'WolfWhale PE 4', chapters: 4, outcomes: ['PE4.1', 'PE4.2', 'PE4.3', 'PE4.4', 'PE4.5', 'PE4.6', 'PE4.7', 'PE4.8', 'PE4.9', 'PE4.10', 'PE4.11', 'PE4.12', 'PE4.13'] },
      { grade: '7', textbook: 'WolfWhale PE 7', chapters: 4, outcomes: ['PE7.1', 'PE7.2', 'PE7.3', 'PE7.4', 'PE7.5', 'PE7.6', 'PE7.7', 'PE7.8', 'PE7.9', 'PE7.10', 'PE7.11', 'PE7.12', 'PE7.13', 'PE7.14'] },
      { grade: '9', textbook: 'WolfWhale PE 9', chapters: 4, outcomes: ['PE9.1', 'PE9.2', 'PE9.3', 'PE9.4', 'PE9.5', 'PE9.6', 'PE9.7', 'PE9.8', 'PE9.9', 'PE9.10', 'PE9.11', 'PE9.12', 'PE9.13'] },
    ],
  },
  {
    subject: 'Career Education',
    color: '#6366F1',
    grades: [
      { grade: '6', textbook: 'WolfWhale Career Ed 6', chapters: 4, outcomes: ['CC6.1', 'CC6.2', 'CC6.3', 'CC6.4'] },
      { grade: '7', textbook: 'WolfWhale Career Ed 7', chapters: 4, outcomes: ['CC7.1', 'CC7.2', 'CC7.3', 'CC7.4'] },
      { grade: '8', textbook: 'WolfWhale Career Ed 8', chapters: 4, outcomes: ['CC8.1', 'CC8.2', 'CC8.3', 'CC8.4'] },
      { grade: '9', textbook: 'WolfWhale Career Ed 9', chapters: 4, outcomes: ['CC9.1', 'CC9.2', 'CC9.3', 'CC9.4'] },
    ],
  },
  {
    subject: 'Core French',
    color: '#14B8A6',
    grades: [
      { grade: '1', textbook: 'WolfWhale French 1', chapters: 4, outcomes: ['CF1.1', 'CF1.2', 'CF1.3', 'CF1.4'] },
    ],
  },
]

export default function CurriculumOutcomesMap() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)

  const stats = useMemo(() => {
    let totalOutcomes = 0
    let totalTextbooks = 0
    let totalChapters = 0
    for (const subject of curriculumData) {
      for (const grade of subject.grades) {
        totalOutcomes += grade.outcomes.length
        totalTextbooks += 1
        totalChapters += grade.chapters
      }
    }
    return { totalOutcomes, totalTextbooks, totalChapters, totalSubjects: curriculumData.length }
  }, [])

  const getSubjectOutcomeCount = (subject: SubjectData) => {
    return subject.grades.reduce((sum, g) => sum + g.outcomes.length, 0)
  }

  const toggleSubject = (subjectName: string) => {
    setExpandedSubject((prev) => (prev === subjectName ? null : subjectName))
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: stats.totalTextbooks, label: 'Textbooks' },
          { value: stats.totalChapters, label: 'Chapters' },
          { value: stats.totalSubjects, label: 'Subjects' },
          { value: 'K\u201312', label: 'Coverage', isText: true },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center"
          >
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {'isText' in stat ? stat.value : stat.value.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Subject Bars */}
      <div className="space-y-2">
        {curriculumData.map((subject) => {
          const isExpanded = expandedSubject === subject.subject
          const outcomeCount = getSubjectOutcomeCount(subject)

          return (
            <div key={subject.subject}>
              {/* Subject Header Bar */}
              <button
                onClick={() => toggleSubject(subject.subject)}
                className="w-full rounded-xl border px-4 py-3 flex items-center justify-between gap-3 transition-colors duration-200 hover:opacity-90 cursor-pointer"
                style={{
                  backgroundColor: `${subject.color}15`,
                  borderColor: `${subject.color}4D`,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {subject.subject}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${subject.color}20`,
                      color: subject.color,
                    }}
                  >
                    {outcomeCount} outcomes
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end">
                    {subject.grades.map((g) => (
                      <span
                        key={g.grade}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${subject.color}20`,
                          color: subject.color,
                        }}
                      >
                        {g.grade}
                      </span>
                    ))}
                  </div>
                  <ChevronDown
                    className="w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>
              </button>

              {/* Expanded Grade Breakdown */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isExpanded ? `${subject.grades.length * 120 + 16}px` : '0px',
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="pt-2 pb-1 space-y-1.5 pl-4 sm:pl-6">
                  {subject.grades.map((grade) => (
                    <div
                      key={grade.grade}
                      className="rounded-lg border px-3 py-2.5"
                      style={{
                        backgroundColor: `${subject.color}08`,
                        borderColor: `${subject.color}20`,
                      }}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                        <div className="flex items-center gap-2 min-w-0 shrink-0">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${subject.color}25`,
                              color: subject.color,
                            }}
                          >
                            {grade.grade}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                            {grade.textbook}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                            {grade.chapters} chapters
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {grade.outcomes.map((outcome) => (
                          <span
                            key={outcome}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium"
                            style={{
                              backgroundColor: `${subject.color}18`,
                              color: subject.color,
                            }}
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Outcomes Footer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {stats.totalOutcomes} curriculum outcomes
          </span>{' '}
          mapped across{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {stats.totalTextbooks} textbooks
          </span>
        </p>
        <a
          href="https://curriculum.gov.sk.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-1 inline-block"
        >
          Source: Saskatchewan Ministry of Education Curriculum
        </a>
      </div>
    </div>
  )
}
