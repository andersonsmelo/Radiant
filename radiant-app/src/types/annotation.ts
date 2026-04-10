export interface AnnotationPoint {
    x: number;
    y: number;
}

export interface ImageAnnotation {
    id: string;
    lessonId: string;
    points: AnnotationPoint[];
    note?: string;
    createdAt: string;
    updatedAt: string;
}
