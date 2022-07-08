import mssql, { Int, VarChar } from "mssql";
import { Delete, Insert, Select, Update } from "./crud";
import { error, log } from "./utils";

async function ConnectionSQL() {
  try {
    return await mssql.connect({
      server: "localhost",
      port: 1433,
      database: "TESTE",
      user: "sa",
      password: "123abc..",
      options: {
        trustServerCertificate: true,
      },
    });
  } catch (err) {
    log(err);
  }
}

const Lista_Update = [
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

ConnectionSQL().then((SQL) => {
  SQL &&
    Select(SQL, `teste2`)
      .then((result) => {
        log("Resultado SELECT  >>", result);
      })
      .catch(error);

  // SQL &&
  //   Insert(SQL, "teste2", [
  //     [
  //       { campo: "descricao", type: VarChar(50), valor: "Nova Descrição!?" },
  //       { campo: "id", type: Int(), valor: 3 },
  //     ],
  //   ])
  //     .then((result) => {
  //       log("Resultado UPDATE >>", result);
  //     })
  //     .catch(error);

  // SQL &&
  //   Update(SQL, "teste2", Lista_Update, [
  //     {
  //       campo: "descricao",
  //       valor: "%?%",
  //       operador: "like",
  //       type: VarChar(),
  //     },
  //   ]).then((result) => {
  //     log("Resultado UPDATE >>", result);
  //   });
  SQL &&
    Delete(SQL, "teste2", [
      {
        campo: "descricao",
        valor: "%?%",
        operador: "like",
        type: VarChar(),
      },
      {
        campo: "id",
        valor: 1,
        operador: "<>",
        type: Int(),
      },
      {
        campo: "id",
        valor: 4,
        type: Int(),
      },
    ]).then((result) => {
      log("Resultado DELETE >>", result);
    });
});

// docker exec -it <container_name> /opt/mssql-tools/bin/sqlcmd -S localhost -U sa
