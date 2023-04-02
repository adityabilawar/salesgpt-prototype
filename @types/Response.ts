export type MessageType = 'Linkedin invite' | 'Intro Email' | 'Coffee Chat' | 'Custom';

export interface ResponseData {
	name: string
	position: string
	company: string
	res: string | undefined
	type: MessageType
}