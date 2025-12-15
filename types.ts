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