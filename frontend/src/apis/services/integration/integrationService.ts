import { DefaultResponse } from "@/lib/type";

import BaseService from "../baseService";
import {
  CreateEventRequest,
  CreateEventResponse,
  CreatePageRequest,
  CreatePageResponse,
  GetDatabaseResponse,
  GetDatabaseResponses,
} from "./type";

class IntegrationService extends BaseService {
  async addToCalander(
    params: CreateEventRequest,
  ): Promise<DefaultResponse<CreateEventResponse>> {
    return await this.http<DefaultResponse<CreateEventResponse>>(
      `/api/google/calendar/add-event`,
      {
        method: "POST",
        body: params,
      },
    );
  }

  async getDatabases() {
    return await this.http<GetDatabaseResponses>(
      `/api/integration/notion/databases`,
      {
        method: "GET",
      },
    );
  }

  async getDatabase(databaseId: string) {
    return await this.http<GetDatabaseResponse>(
      `/api/integration/notion/database/${databaseId}`,
      {
        method: "GET",
      },
    );
  }

  async createPage(params: CreatePageRequest) {
    return await this.http<DefaultResponse<CreatePageResponse>>(
      `/api/integration/notion/page`,
      {
        method: "POST",
        body: params,
      },
    );
  }
}

const integrationService = new IntegrationService();

export default integrationService;
