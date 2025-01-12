import { FileService } from './../core/files/files.service';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { CommandExecute } from '../core/executor/command.executor';
import { IStreamLogger } from '../core/handlers/stream-logger.interface';
import { FfmpegBuilder } from './ffmpeg/ffmpeg.builder';
import { IFfmpeg, IcommandExecFfmpeg } from './ffmpeg/ffmpeg.types';
import { PromptService } from '../core/prompt/prompt.service';
import { StreamHandler } from '../core/handlers/stream.handler';



export class FfmpegExecutor extends CommandExecute<IFfmpeg>{
	
	private fileService: FileService = new FileService()
	private promptService: PromptService = new PromptService()
	constructor(logger: IStreamLogger){
		super(logger)
	}
	protected async prompt(): Promise<IFfmpeg> {
		const width = await this.promptService.input<number>('Ширина', 'number')
		const height = await this.promptService.input<number>('Высота', 'number')
		const path = await this.promptService.input<string>('Путь до файла', 'input')
		const name = await this.promptService.input<string>('Имя файла','input')
		return {width, height, path, name}
	}
	protected build({width, height, path, name}: IFfmpeg): IcommandExecFfmpeg {
		const output = this.fileService.getFilePath(path, name, 'mp4')
		const args = (new FfmpegBuilder)
			.input(path)
			.setVideoSize(width, height)
			.output(output)

		return {command: 'ffmpeg' , args, output}
	}
	protected spawn({output, command, args}: IcommandExecFfmpeg): ChildProcessWithoutNullStreams {
		this.fileService.deleteFile(output)
		return spawn(command, args)
	}
	protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
		const handler = new StreamHandler(logger)
		handler.processOutput(stream)
	}
}