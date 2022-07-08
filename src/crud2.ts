import { connect, ConnectionPool } from "mssql";
import { IValoresToInput, IWhere, Lista_To_Update } from "./types2";
import {
  Adiciona_Where,
  error,
  Join_Campo_e_Valor_To_Update,
  Join_Campo_e_Valor_To_Where,
  Listas_Propriedade_Separadas_Insert,
  Listas_Propriedade_Separadas_Update,
  Listas_Propriedade_Separadas_Where,
  log,
  RegisterValues,
} from "./utils";

export function Select(tabela: string) {
  let table = tabela;
  let query = `SELECT * FROM ${table} `;
  let where = "";
  let fields = ["*"];
  let Top = "";

  function setFields(...field: string[]) {
    fields = field;
    query =
      `SELECT ${Top} ${field.join(", ").toUpperCase()} FROM ${tabela} ` + where;
    return query;
  }
  function setTop(qtdRegisters: number) {
    Top = "TOP " + qtdRegisters.toString();
    query =
      `SELECT ${Top} ${qtdRegisters}  ${fields
        .join(", ")
        .toUpperCase()} FROM ${tabela} ` + where;
    return query;
  }
  function setWhere(conditionsWhere: IWhere[], operator?: string) {
    where =
      " WHERE " +
      Join_Campo_e_Valor_To_Where(
        Listas_Propriedade_Separadas_Where(conditionsWhere)
      ).join(operator ? " " + operator + " " : " AND ");
    query += where;
    return query;
  }
  function getTable() {
    return table;
  }
  function getQuery() {
    return query;
  }
  return {
    getQuery,
    getTable,
    setFields,
    setTop,
    setWhere,
  };
}
export async function Insert(
  SQl: ConnectionPool,
  tabela: string,
  Lista_To_Insert: IValoresToInput[][]
) {
  // const transaction = SQl.transaction();
  // transaction.begin();
  try {
    for (let i = 0; i < Lista_To_Insert.length; i++) {
      const Valores_To_Insert = Lista_To_Insert[i];
      const request = RegisterValues(SQl.request(), Valores_To_Insert);
      const Lista_Campos =
        Listas_Propriedade_Separadas_Insert(Valores_To_Insert).campo;
      const Lista_Campos_Input =
        Listas_Propriedade_Separadas_Insert(Valores_To_Insert).campo_input;

      let query = `INSERT INTO ${tabela}  (${Lista_Campos.join(
        ","
      )}) VALUES (${Lista_Campos_Input.join(", ")}) `;

      query += ";";
      log("INSERT query: ", query);
      await request.query(query);
    }
    // await transaction.commit();
  } catch (err) {
    // await transaction.rollback();
    return Promise.reject(err);
  }
}
export async function Update(
  SQl: ConnectionPool,
  tabela: string,
  Lista_To_Update: Lista_To_Update[],
  where?: IWhere[]
) {
  // const transaction = SQl.transaction();
  // transaction.begin();
  try {
    for (let i = 0; i < Lista_To_Update.length; i++) {
      const Valores_To_Update = Lista_To_Update[i];
      let request = RegisterValues(SQl.request(), Valores_To_Update.valores);
      const Lista_Campos_Com_Valores = Join_Campo_e_Valor_To_Update(
        Listas_Propriedade_Separadas_Update(Valores_To_Update.valores)
      );

      let query = `UPDATE ${tabela} SET ${Lista_Campos_Com_Valores.join(",")} `;
      if (Valores_To_Update.where) {
        request = RegisterValues(request, Valores_To_Update.where, true);
      }

      if (where) {
        request = RegisterValues(request, where, true);
      }

      query += Adiciona_Where(Valores_To_Update.where, where);
      query += ";";
      log("UPDATE query: ", query);
      await request.query(query);
    }
    // await transaction.commit();
  } catch (err) {
    // await transaction.rollback();
    return Promise.reject(err);
  }
}
export async function Delete(
  SQl: ConnectionPool,
  tabela: string,
  where?: IWhere[]
) {
  try {
    let query = `DELETE ${tabela} `;
    if (where) {
      const Lista_Where = Join_Campo_e_Valor_To_Where(
        Listas_Propriedade_Separadas_Where(where)
      );
      query += ` WHERE ${Lista_Where.join(" AND ")}`;
    }
    query += ";";
    log("DELETE query >>", query);
    return await SQl.query(query);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function ConnectionSQL() {
  try {
    return await connect({
      server: "localhost",
      port: 1433,
      database: "Recapadora",
      user: "sa",
      password: "123abc.",
      options: {
        trustServerCertificate: true,
      },
    });
  } catch (err) {
    log(err);
  }
}
