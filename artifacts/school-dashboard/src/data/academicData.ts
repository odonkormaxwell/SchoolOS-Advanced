// ─── Assessment Components (weights sum to 100) ─────────────────────────────
export type AssessmentStatus = "draft" | "submitted" | "approved" | "published" | "locked";

export interface ComponentDef {
  id: keyof ComponentScores;
  label: string;
  short: string;
  max: number;
}

export interface ComponentScores {
  classEx:  number;
  homework: number;
  project:  number;
  midterm:  number;
  exam:     number;
}

export const ASSESSMENT_COMPONENTS: ComponentDef[] = [
  { id: "classEx",  label: "Class Exercises", short: "Class Ex", max: 10 },
  { id: "homework", label: "Homework",         short: "HW",       max: 10 },
  { id: "project",  label: "Project Work",     short: "Project",  max: 10 },
  { id: "midterm",  label: "Mid-Term",         short: "Mid-Term", max: 20 },
  { id: "exam",     label: "End of Term Exam", short: "Exam",     max: 50 },
];

// ─── Grade Scale (Ghana Basic/JHS standard) ──────────────────────────────────
export interface GradeRule {
  min: number;
  grade: string;
  remark: string;
  color: string;
  bg: string;
}

export const GRADE_SCALE: GradeRule[] = [
  { min: 80, grade: "A",  remark: "Excellent",          color: "#16a34a", bg: "#dcfce7" },
  { min: 70, grade: "B+", remark: "Very Good",          color: "#2563eb", bg: "#dbeafe" },
  { min: 60, grade: "B",  remark: "Good",               color: "#0891b2", bg: "#cffafe" },
  { min: 50, grade: "C+", remark: "Fairly Good",        color: "#d97706", bg: "#fef3c7" },
  { min: 40, grade: "C",  remark: "Pass",               color: "#ea580c", bg: "#ffedd5" },
  { min: 30, grade: "D",  remark: "Below Average",      color: "#dc2626", bg: "#fee2e2" },
  { min: 0,  grade: "F",  remark: "Needs Improvement",  color: "#7f1d1d", bg: "#fef2f2" },
];

export function getGrade(total: number): GradeRule {
  return GRADE_SCALE.find((g) => total >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
}

export function calcTotal(s: ComponentScores): number {
  return s.classEx + s.homework + s.project + s.midterm + s.exam;
}

// ─── JHS 3 Class Roster (demo) ───────────────────────────────────────────────
export interface AcademicStudent {
  id: number;
  name: string;
  initials: string;
  gender: "M" | "F";
  studentId: string;
  avatarBg: string;
  avatarColor: string;
}

export const JHS3_STUDENTS: AcademicStudent[] = [
  { id: 1, name: "Adjoa Mensah",       initials: "AM", gender: "F", studentId: "HKBS-2024-0067", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 2, name: "Kofi Junior",        initials: "KJ", gender: "M", studentId: "HKBS-2024-0012", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: 3, name: "Ama Serwaa Ofori",   initials: "AS", gender: "F", studentId: "HKBS-2024-0013", avatarBg: "#fce7f3", avatarColor: "#9d174d" },
  { id: 4, name: "Daniel Lartey",      initials: "DL", gender: "M", studentId: "HKBS-2024-0014", avatarBg: "#dbeafe", avatarColor: "#1e3a8a" },
  { id: 5, name: "Kwame Asante",       initials: "KA", gender: "M", studentId: "HKBS-2024-0042", avatarBg: "#bfdbfe", avatarColor: "#1e3a8a" },
  { id: 6, name: "Emmanuel Kofi Adu",  initials: "EK", gender: "M", studentId: "HKBS-2024-0033", avatarBg: "#e0e7ff", avatarColor: "#3730a3" },
  { id: 7, name: "Yaw Antwi Boakye",   initials: "YA", gender: "M", studentId: "HKBS-2024-0016", avatarBg: "#fef9c3", avatarColor: "#713f12" },
  { id: 8, name: "Abena Dufie Ansah",  initials: "AD", gender: "F", studentId: "HKBS-2024-0058", avatarBg: "#d1fae5", avatarColor: "#065f46" },
];

// ─── Subject codes for JHS 3 ─────────────────────────────────────────────────
export const JHS3_SUBJECTS: { code: string; name: string; teacher: string; tInitials: string; tBg: string; tColor: string }[] = [
  { code: "MTH", name: "Mathematics",       teacher: "Mr. K. Mensah",    tInitials: "KM", tBg: "#bfdbfe", tColor: "#1e3a8a" },
  { code: "ENG", name: "English Language",  teacher: "Mrs. A. Asante",   tInitials: "AA", tBg: "#fce7f3", tColor: "#9d174d" },
  { code: "SCI", name: "Integrated Science",teacher: "Mrs. A. Boateng",  tInitials: "AB", tBg: "#fce7f3", tColor: "#9d174d" },
  { code: "SST", name: "Social Studies",    teacher: "Mr. N. Lartey",    tInitials: "NL", tBg: "#dbeafe", tColor: "#1e3a8a" },
  { code: "ICT", name: "ICT",               teacher: "Mr. K. Opoku",     tInitials: "KO", tBg: "#e0e7ff", tColor: "#3730a3" },
  { code: "FRN", name: "French",            teacher: "Mme. A. Boakye",   tInitials: "AB", tBg: "#fce7f3", tColor: "#9d174d" },
  { code: "RME", name: "RME",               teacher: "Mrs. A. Boateng",  tInitials: "AB", tBg: "#fce7f3", tColor: "#9d174d" },
  { code: "GHL", name: "Ghanaian Language", teacher: "Mme. A. Boakye",   tInitials: "AB", tBg: "#fce7f3", tColor: "#9d174d" },
  { code: "PE",  name: "Physical Education",teacher: "Coach A. Gyasi",   tInitials: "AG", tBg: "#dcfce7", tColor: "#15803d" },
];

// ─── Score Data: [classEx, homework, project, midterm, exam] ─────────────────
// All components sum to 100 per subject
type ScoreRow = [number, number, number, number, number];
type SubjectScoreMap = Record<number, ScoreRow>;

export const SUBJECT_SCORES: Record<string, SubjectScoreMap> = {
  MTH: { 1:[9,8,9,18,44], 2:[8,8,8,17,44], 3:[8,7,8,16,43], 4:[7,7,7,15,39], 5:[6,6,6,13,31], 6:[5,5,5,10,25], 7:[4,4,4,9,19],  8:[8,7,8,15,39] },
  ENG: { 1:[9,9,8,17,45], 2:[8,8,8,17,44], 3:[9,8,8,18,47], 4:[7,7,7,15,42], 5:[7,6,6,14,37], 6:[5,5,5,11,26], 7:[4,4,4,9,20],  8:[8,7,7,15,40] },
  SCI: { 1:[8,8,9,17,43], 2:[8,7,8,16,43], 3:[8,8,8,16,40], 4:[7,6,7,14,38], 5:[6,5,6,12,29], 6:[4,5,5,10,24], 7:[3,4,4,9,18],  8:[8,7,7,15,38] },
  SST: { 1:[9,9,8,18,47], 2:[8,8,8,18,46], 3:[8,8,8,17,44], 4:[8,7,7,16,42], 5:[7,6,6,14,39], 6:[5,5,5,11,29], 7:[4,4,4,9,24],  8:[8,8,7,16,40] },
  ICT: { 1:[9,9,9,19,49], 2:[9,8,8,18,49], 3:[8,8,8,17,47], 4:[8,7,8,16,46], 5:[7,7,7,14,43], 6:[6,5,6,12,31], 7:[5,5,5,10,27], 8:[8,7,8,15,45] },
  FRN: { 1:[8,7,8,15,40], 2:[7,7,7,14,40], 3:[8,7,7,14,36], 4:[6,6,6,13,37], 5:[5,5,5,11,29], 6:[4,4,4,9,21],  7:[3,3,3,8,18],  8:[7,6,6,13,35] },
  RME: { 1:[9,8,8,17,46], 2:[8,8,7,16,45], 3:[9,8,8,18,44], 4:[8,7,7,16,42], 5:[7,7,6,14,40], 6:[6,6,5,12,31], 7:[5,5,4,10,26], 8:[8,7,8,15,42] },
  GHL: { 1:[8,8,8,17,44], 2:[8,7,7,16,42], 3:[8,8,7,16,43], 4:[7,7,6,14,40], 5:[7,6,6,13,38], 6:[5,5,5,11,27], 7:[4,4,4,9,22],  8:[8,7,7,15,39] },
  PE:  { 1:[9,9,9,19,50], 2:[9,8,9,19,48], 3:[8,8,9,18,47], 4:[8,8,8,18,46], 5:[8,7,7,17,43], 6:[7,7,6,15,40], 7:[7,6,6,14,38], 8:[8,8,8,18,46] },
};

export function rowToScores(row: ScoreRow): ComponentScores {
  return { classEx: row[0], homework: row[1], project: row[2], midterm: row[3], exam: row[4] };
}

// ─── Workflow status per subject ──────────────────────────────────────────────
export const WORKFLOW_STATUS: { code: string; status: AssessmentStatus; date: string }[] = [
  { code: "MTH", status: "submitted", date: "28 May 2026" },
  { code: "ENG", status: "approved",  date: "27 May 2026" },
  { code: "SCI", status: "draft",     date: "" },
  { code: "SST", status: "published", date: "25 May 2026" },
  { code: "ICT", status: "locked",    date: "22 May 2026" },
  { code: "FRN", status: "draft",     date: "" },
  { code: "RME", status: "submitted", date: "29 May 2026" },
  { code: "GHL", status: "draft",     date: "" },
  { code: "PE",  status: "approved",  date: "26 May 2026" },
];

export const STATUS_STYLE: Record<AssessmentStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: "Draft",             color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
  submitted: { label: "Awaiting Approval", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
  approved:  { label: "Approved",          color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
  published: { label: "Published",         color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  locked:    { label: "Locked",            color: "#374151", bg: "#f3f4f6", border: "#e5e7eb" },
};
