import { Int, Request, VarChar } from "mssql";
import { ConnectionSQL, Delete, Insert, Select, Update } from "./crud2";
import { error, log, RegisterValues } from "./utils";

const Lista_To_Update = [
  {
    valores: [
      {
        campo: "id",
        type: Int(),
        valor: 1,
      },
      {
        campo: "descricao",
        type: VarChar(100),
        valor: "Id Alterado para 5 ",
      },
    ],
    // where: [
    //   {
    //     campo: "id",
    //     valor: 1,
    //     type: Int(),
    //     is_null: true,
    //   },
    // ],
  },
];
const Lista_To_Insert = [
  [
    { campo: "descricao", type: VarChar(50), valor: "Nova Descrição!?" },
    { campo: "id", type: Int(), valor: 3 },
  ],
];
const Where_Geral_Update = [
  {
    campo: "descricao",
    valor: "%?%",
    operador: "like",
    type: VarChar(),
  },
];
const Where_Delete = [
  {
    campo: "descricao",
    valor: "%?%",
    operador: "like",
    type: VarChar(),
  },
];
const where_select = [
  {
    valor: 50,
    type: Int(),
    campo: "CodOrcamento",
    operador: ">",
  },
];

async function Start() {
  const SQL = await ConnectionSQL();
  let request: Request;
  if (SQL) {
    try {
      // const query_select = Select("OrcamentoBalcao");
      // query_select.setTop(2);
      // query_select.setFields("CodOrcamento", "CodVendedor", "DataDigitacao");
      // query_select.setWhere(where_select);
      // request = RegisterValues(SQL.request(), where_select, true);
      // const resul_select = await request.query(query_select.getQuery());
      // log("SELECT >>", resul_select);
      // const query_update = Update("OrcamentoBalcao");
      // query_update.setTop(2);
      // query_update.setFields("CodOrcamento", "CodVendedor", "DataDigitacao");
      // query_update.setWhere(...Where_Geral_Update);
      // request = RegisterValues(SQL.request(), Where_Geral_Update, true);
      // const resul_update = await request.query(query_update.getQuery());
      // log("UPDATE >>", resul_update);
      //  const resul_insert = await Insert(SQL, "Teste", Lista_To_Insert);
      // log("INSERT >>", resul_insert);
      // const resul_update = await Update(
      //   SQL,
      //   "Teste",
      //   Lista_To_Update,
      //   Where_Geral_Update
      // );
      // log("UPDATE >>", resul_update);
      // const resul_delete = await Delete(SQL, "Teste", Where_Delete);
      // log("DELETE >>", resul_delete);
      // await SQL.transaction().commit();
    } catch (e) {
      await SQL.transaction().rollback();
      error(e);
    }
  }
}

Start();

// docker exec -it <container_name> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa
