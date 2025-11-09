enum PagePath {
  GARAGE = '/',
  WINNERS = '/winners',
  NOT_FOUND = '/404',
}

enum EngineStatus {
  Started = 'started',
  Stopped = 'stopped',
  Drive = 'drive',
}

enum SortField {
  ID = 'id',
  WINS = 'wins',
  TIME = 'time',
}

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export { PagePath, EngineStatus, SortField, SortOrder };
