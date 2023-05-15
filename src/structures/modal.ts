import type { APIActionRowComponent, APITextInputComponent, TextInputBuilder } from 'discord.js';

export class Modal {
    title: ModalOptions['title'];
    custom_id: ModalOptions['custom_id'];
    components: Array<APIActionRowComponent<APITextInputComponent>>;
    constructor(options: ModalOptions, ...textInputs: Array<TextInputBuilder>) {
        this.title = options.title;
        this.custom_id = options.custom_id;
        this.components = textInputs.map(
            (input) =>
                ({
                    type: 1,
                    components: [input.data.style ? input.data : ((input.data.style = 1), input.data)],
                } as APIActionRowComponent<APITextInputComponent>)
        );
    }
}

export type ModalOptions = {
    title: string;
    custom_id: string;
};
