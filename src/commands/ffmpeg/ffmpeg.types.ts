import { ICommandExec } from "../../core/executor/command.types"



export interface IFfmpeg{
	width: number
	height: number
	path: string
	name: string
}

export interface IcommandExecFfmpeg extends ICommandExec{
	output: string
}