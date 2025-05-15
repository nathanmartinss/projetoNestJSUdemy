class ITask {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  createAdt: Date | null;
  userId: number | null;
}

export class ResponseFindOneUserDTO {
  id: number;
  name: string;
  Task: ITask[];
  email: string;
  avatar: string | null;
}

export class ResponseCreateUserDTO {
  id: number;
  name: string;
  email: string;
}

export class ResponseUploadFileDTO {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}