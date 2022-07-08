import { Bit, ConnectionPool, Int, ISqlType, Request } from "mssql";
import { IValoresToInput, IWhere, Lista_To_Update } from "./types";
import {
  Adiciona_Where,
  error,
  Join_Campo_e_Valor_To_Update,
  Join_Campo_e_Valor_To_Where,
  Listas_Propriedade_Separadas_Insert,
  Listas_Propriedade_Separadas_Update,
  Listas_Propriedade_Separadas_Where,
  log,
  MakeInputs,
} from "./utils";

export async function Select(
  SQl: ConnectionPool,
  tabela: string,
  where?: IWhere[],
  campo?: string[]
) {
  try {
    let query = `SELECT ${campo ? campo.join(" ,") : "*"} FROM ${tabela} `;
    if (where) {
      const Lista_Where = Join_Campo_e_Valor_To_Where(
        Listas_Propriedade_Separadas_Where(where)
      );
      query = ` WHERE ${Lista_Where.join(" AND ")}`;
    }
    query += ";";
    log("SELECT query >>", query);
    return await SQl.query(query);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function Update(
  SQl: ConnectionPool,
  tabela: string,
  Lista_To_Update: Lista_To_Update[],
  where?: IWhere[]
) {
  const transaction = SQl.transaction();
  transaction.begin();
  try {
    for (let i = 0; i < Lista_To_Update.length; i++) {
      const Valores_To_Update = Lista_To_Update[i];
      let request = MakeInputs(SQl.request(), Valores_To_Update.valores);
      const Lista_Campos_Com_Valores = Join_Campo_e_Valor_To_Update(
        Listas_Propriedade_Separadas_Update(Valores_To_Update.valores)
      );

      let query = `UPDATE ${tabela} SET ${Lista_Campos_Com_Valores.join(",")} `;
      if (Valores_To_Update.where) {
        request = MakeInputs(request, Valores_To_Update.where, true);
      }

      if (where) {
        request = MakeInputs(request, where, true);
      }

      query += Adiciona_Where(Valores_To_Update.where, where);
      query += ";";
      log("UPDATE query: ", query);
      await request.query(query);
    }
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    return Promise.reject(err);
  }
}

export async function Insert(
  SQl: ConnectionPool,
  tabela: string,
  Lista_To_Insert: IValoresToInput[][]
) {
  const transaction = SQl.transaction();
  transaction.begin();
  try {
    for (let i = 0; i < Lista_To_Insert.length; i++) {
      const Valores_To_Insert = Lista_To_Insert[i];
      const request = MakeInputs(SQl.request(), Valores_To_Insert);
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
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    return Promise.reject(err);
  }
}
