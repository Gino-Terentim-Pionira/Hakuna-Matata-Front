import React, { FC, ReactElement } from 'react';
import {
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalContent,
	ModalOverlay,
	ModalCloseButton,
	Divider,
} from '@chakra-ui/react';

type CustomModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	onClickClose?: VoidFunction;
	modalTitle?: string;
	modalBody?: ReactElement;
	buttonBody?: ReactElement;
    modalSize: string
};

const CustomModal: FC<CustomModalProps> = ({
	isOpen,
	onClose,
	onClickClose,
	modalTitle,
	modalBody,
	buttonBody,
    modalSize
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
            size={modalSize}
            scrollBehavior='inside'
		>
			<ModalOverlay>
				<ModalContent>
					<ModalHeader fontSize='lg' fontWeight='bold'>
						{modalTitle}
					</ModalHeader>
					<ModalCloseButton onClick={onClickClose} />
					<Divider width='90%' alignSelf='center' />
					<ModalBody>
						{modalBody}
					</ModalBody>
                    {
                        buttonBody ? (
                            <ModalFooter>{buttonBody}</ModalFooter>
                        ) : null
                    }
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
};

export default CustomModal;
