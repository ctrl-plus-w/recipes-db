import { MergeDeep } from "type-fest";

import { Database as DatabaseGenerated } from "@/type/database-generated.types";

export type { Json } from "@/type/database-generated.types";

export type Database = MergeDeep<DatabaseGenerated, { public: { Views: {} } }>;
