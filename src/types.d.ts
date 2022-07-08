import { ISqlType } from "mssql";

export interface IWhere {
  campo: string;
  operador?: string;
  valor: string | number | boolean | Date;
  type: ISqlType;
  is_null?: boolean;
}

export interface IValoresToInput {
  campo: string;
  valor: string | number | boolean | Date;
  type: ISqlType;
  is_null?: boolean;
}
export interface IDadosAgrupadosInsert {
  campo_input: string[];
  campo: string[];
  type: ISqlType[];
  valor: string[];
}
export interface IDadosAgrupadosUpdate {
  campo_input: string[];
  campo: string[];
  type: ISqlType[];
  valor: string[];
  is_null: boolean[];
}
export interface IDadosAgrupadosWhere {
  campo_input: string[];
  campo: string[];
  operador: string[];
  valor: string[];
  type: ISqlType[];
  is_null: boolean[];
}
export interface Lista_To_Update {
  valores: IValoresToInput[];
  where?: IWhere[];
}

export enum Actions {
  Select,
  Insert,
  Update,
  Delete,
}
