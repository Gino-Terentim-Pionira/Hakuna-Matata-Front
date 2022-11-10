import React, { FC, ReactElement, useRef } from 'react';
import {
	Text,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogCloseButton,
} from '@chakra-ui/react';

type AlertModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	onClickClose?: VoidFunction;
	alertTitle?: string;
	alertBody?: string;
	buttonBody: ReactElement;
};

const AlertModal: FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onClickClose,
	alertTitle,
	alertBody,
	buttonBody,
}) => {
	const cancelRef = useRef<HTMLButtonElement>(null);

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						{alertTitle}
					</AlertDialogHeader>
					<AlertDialogCloseButton onClick={onClickClose} />
					<AlertDialogBody>
						<Text>{alertBody}</Text>
					</AlertDialogBody>
					<AlertDialogFooter>{buttonBody}</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

export default AlertModal;
