import { format, parseISO, startOfWeek, endOfWeek, addDays, differenceInDays } from 'date-fns';

export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
    return format(parseISO(dateString), formatStr);
}

export function formatTime(dateString: string): string {
    return format(parseISO(dateString), 'h:mm a');
}

export function formatDateTime(dateString: string): string {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
}

export function getRelativeDate(dateString: string): string {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInDays = differenceInDays(now, date);

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays === -1) return 'Tomorrow';
    if (diffInDays > 0 && diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 0 && diffInDays > -7) return `In ${Math.abs(diffInDays)} days`;

    return formatDate(dateString);
}

export function getWeekNumber(date: Date = new Date()): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export function getSprintDates(weekNumber: number, year: number = 2026) {
    const startOfYear = new Date(year, 0, 1);
    const daysToAdd = (weekNumber - 1) * 7;
    const sprintStart = addDays(startOfYear, daysToAdd);
    const sprintEnd = addDays(sprintStart, 6);

    return {
        startDate: format(sprintStart, 'yyyy-MM-dd'),
        endDate: format(sprintEnd, 'yyyy-MM-dd'),
    };
}

export function isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
}

export function daysUntilDue(dueDate: string): number {
    return differenceInDays(parseISO(dueDate), new Date());
}

export const isDueSoon = (dueDate: string): boolean => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffInDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays > 0 && diffInDays < 7;
};

// Sprint helpers
export const getSprintName = (date: Date): string => {
    const year = date.getFullYear();
    const weekNum = getWeekNumber(date);
    return `S${weekNum}-${year}`;
};

export const getWeekStartDate = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day; // Sunday is 0
    const startDate = new Date(date);
    startDate.setDate(diff);
    return startDate;
};

export const getWeekEndDate = (date: Date): Date => {
    const startDate = getWeekStartDate(new Date(date));
    return addDays(startDate, 6); // Saturday
};

export const isSameWeek = (date1: Date, date2: Date): boolean => {
    const week1Start = getWeekStartDate(new Date(date1));
    const week2Start = getWeekStartDate(new Date(date2));
    return week1Start.getTime() === week2Start.getTime();
};

export const getSprintColor = (date: Date): 'red' | 'yellow' | 'green' => {
    const today = new Date();
    if (isSameWeek(date, today)) return 'yellow';
    if (date < today) return 'red';
    return 'green';
};
