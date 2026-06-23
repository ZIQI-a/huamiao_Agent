import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// 创建 SQLite 数据库连接
// 数据库文件保存在项目根目录的 data 文件夹
const sqlite = new Database("data/huamiao.db");

// 启用 WAL 模式（提高并发性能）
sqlite.pragma("journal_mode = WAL");

// 创建 Drizzle 实例
export const db = drizzle(sqlite, { schema });

