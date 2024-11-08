export interface Doc {
  id: string;
  title: string;
  content: string;
  owner_id: string;
  is_public: boolean;
  can_edit: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}
