import { Bit, Int, ISqlType, Request } from "mssql";
import {
  IDadosAgrupadosInsert,
  IDadosAgrupadosUpdate,
  IDadosAgrupadosWhere,
  IValoresToInput,
  IWhere,
} from "./types";

export function Listas_Propriedade_Separadas_Update(
  valores: IValoresToInput[]
) {
  let Dados_Agrupados: IDadosAgrupadosUpdate = {
    campo_input: [],
    campo: [],
    type: [],
    valor: [],
    is_null: [],
  };
  valores.forEach((obj) => {
    for (let [key, value] of Object.entries(obj)) {
      if (key === "campo") {
        Dados_Agrupados["campo_input"].push("@" + value);
        Dados_Agrupados[key].push(value);
      } else {
        Dados_Agrupados[key].push(value);
      }
    }
  });
  return Dados_Agrupados;
}
export function Listas_Propriedade_Separadas_Insert(
  valores: IValoresToInput[]
) {
  let Dados_Agrupados: IDadosAgrupadosInsert = {
    campo_input: [],
    campo: [],
    type: [],
    valor: [],
  };
  valores.forEach((obj) => {
    for (let [key, value] of Object.entries(obj)) {
      if (key === "campo") {
        Dados_Agrupados["campo_input"].push("@" + value);
        Dados_Agrupados[key].push(value);
      } else {
        Dados_Agrupados[key].push(value);
      }
    }
  });
  return Dados_Agrupados;
}
export function Listas_Propriedade_Separadas_Where(valores: IWhere[]) {
  let Dados_Agrupados: IDadosAgrupadosWhere = {
    campo_input: [],
    campo: [],
    operador: [],
    valor: [],
    type: [],
    is_null: [],
  };
  valores.forEach((obj) => {
    for (let [key, value] of Object.entries(obj)) {
      if (key === "campo") {
        Dados_Agrupados["campo_input"].push("@" + value);
        Dados_Agrupados[key].push(value);
      } else {
        const new_value = key === "operador" && !value ? "=" : value;
        Dados_Agrupados[key].push(new_value);
      }
    }
  });
  return Dados_Agrupados;
}
function isnull_or_not(is_null?: Boolean) {
  if (is_null === false) {
    return "IS NOT NULL";
  }
  return "IS NULL";
}
export function MakeInputs(
  request: Request,
  valores: IValoresToInput[],
  isWhere?: Boolean
) {
  valores.forEach((obj) => {
    // const NullOrNot = isnull_or_not(obj, isWhere);
    // if (NullOrNot !== obj.valor) {
    //   request.input(isWhere ? obj.campo + "_where" : obj.campo, NullOrNot);
    // } else {
    obj.type
      ? request.input(
          isWhere ? obj.campo + "_where" : obj.campo,
          obj.type,
          obj.valor
        )
      : request.input(isWhere ? obj.campo + "_where" : obj.campo, obj.valor);
    // }
  });
  return request;
}
export function Join_Campo_e_Valor_To_Update(Listas: IDadosAgrupadosUpdate) {
  const result: string[] = [];
  Listas.campo.forEach((campo, index) => {
    result.push(`${campo} = ${Listas.campo_input[index]}`);
  });
  return result;
}
export function Join_Campo_e_Valor_To_Where(Listas: IDadosAgrupadosWhere) {
  const result: string[] = [];
  Listas.campo.forEach((campo, index) => {
    if (Listas.is_null[index] === false || Listas.is_null[index] === true) {
      result.push(`${campo} ${isnull_or_not(Listas.is_null[index])}`);
    } else {
      result.push(
        `${campo} ${Listas.operador[index]} ${
          Listas.campo_input[index] + "_where"
        }`
      );
    }
  });
  return result;
}
export function Adiciona_Where(
  where_especifico?: IWhere[],
  where_geral?: IWhere[]
) {
  function ListaWhere() {
    if (where_especifico)
      return Join_Campo_e_Valor_To_Where(
        Listas_Propriedade_Separadas_Where(where_especifico)
      );

    if (where_geral)
      return Join_Campo_e_Valor_To_Where(
        Listas_Propriedade_Separadas_Where(where_geral)
      );
    return "";
  }
  const Lista_Where = ListaWhere();
  if (Lista_Where !== "") {
    return ` WHERE ${Lista_Where.join(" AND ")}`;
  }
  return "";
}

export function log(...param: any | []) {
  if (param instanceof Array) {
    return param.map((value) => {
      console.log(value);
    });
  }
  console.log(param);
}
export function error(...param: any | []) {
  if (param instanceof Array) {
    return param.map((value) => {
      console.log(value);
    });
  }
  console.log(param);
}
