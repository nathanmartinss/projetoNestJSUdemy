export class ResponseTaskDTO {
  name: string;
  description: string;
  id: number;
  completed: boolean;
  createAt?: Date | null;
  userId: number | null;
}