import { Int, VarChar } from "mssql";
import { ConnectionSQL, Delete, Insert, Select, Update } from "./crud2";
import { error, log } from "./utils";

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

async function Start() {
  const SQL = await ConnectionSQL();
  if (SQL) {
    try {
      // await SQL.transaction().begin();

      const query_select = await Select(SQL, "Teste");
      const resul_select = await SQL.query(query_select);
      log("SELECT >>", query_select, resul_select);
      // const resul_insert = await Insert(SQL, "Teste", Lista_To_Insert);
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
