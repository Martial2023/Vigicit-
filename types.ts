export type ReportStatusProps = "SUBMITTED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"

export interface ReportFormDataProps {
    title: string;
    categoryId: string;
    description: string;
    address: string;
    geoLocation: {
        latitude: string;
        longitude: string;
    };
    date: Date | null;
    contact: string;
    images: string[];
    status: ReportStatusProps;
}

export interface ReportCategoryProps {
    id: string;
    name: string;
    description: string | null;
}

export interface ReportProps {
    id: string;
    title: string;
    categoryId: string;
    categoryName: string;
    description: string;
    address: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
    date: Date | null;
    contact: string | null;
    images: string[];
    status: ReportStatusProps;
    userId: string;
    user: {
        userName: string;
        email: string;
        image: string | null;
    } | null;
}

export interface CommentProps {
    id: string;
    reportId: string;
    user: string;
    userImage: string | null;
    content: string;
    createdAt: Date;
}
export interface ReportWithCommentsProps extends ReportProps {
    comments: CommentProps[];
}

export interface ReportStatProps {
    reports: ReportProps[];
    totalReports: number;
    reportsByStatus: {
        [key in ReportStatusProps]: number;
    };
}

export interface ReportCategoryProps {
    id: string;
    name: string;
    description: string | null;
}

export const statusConfig: Record<ReportStatusProps, { label: string, color: string }> = {
    SUBMITTED: { label: 'Soumis', color: 'bg-blue-500 hover:bg-blue-600' },
    IN_PROGRESS: { label: 'En cours', color: 'bg-yellow-500 hover:bg-yellow-600' },
    RESOLVED: { label: 'Résolu', color: 'bg-green-500 hover:bg-green-600' },
    REJECTED: { label: 'Rejeté', color: 'bg-red-500 hover:bg-red-600' }
}