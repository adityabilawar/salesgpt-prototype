export type MessageType = 'Linkedin invite' | 'Intro Email' | 'Coffee Chat' | 'Custom Prompt';

export interface ResponseData {
	name: string
	position?: string
	company?: string
	res: string | undefined
	type: MessageType
}