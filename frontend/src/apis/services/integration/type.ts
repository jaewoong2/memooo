export interface CreatePageRequest {
  databaseId: string;
  checkboxes: { name: string; checked: boolean }[];
  createdTime: string;
  pageTitle: string;
}

export interface CreatePageResponse {
  url: string;
  public_url?: string;
}

export type GetDatabaseResponses = {
  title: string;
  url: string;
}[];

export interface GetDatabaseResponse {
  [key: string]: {
    id: string;
    name: string;
    type: string;
    description?: string;
  };
}

export interface CreateEventRequest {
  summary?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface CreateEventResponse {
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}
