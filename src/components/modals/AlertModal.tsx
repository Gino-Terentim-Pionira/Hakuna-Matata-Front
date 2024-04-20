import React, { FC, ReactElement, useRef } from 'react';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogCloseButton,
} from '@chakra-ui/react';
import colorPalette from '../../styles/colorPalette';

export type AlertModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	onClickClose?: VoidFunction;
	alertTitle?: string;
	alertBody?: string | ReactElement;
	buttonBody: ReactElement;
	closeOnOverlayClick: boolean;
};

const AlertModal: FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onClickClose,
	alertTitle,
	alertBody,
	buttonBody,
 	closeOnOverlayClick = true
}) => {
	const cancelRef = useRef<HTMLButtonElement>(null);

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			closeOnOverlayClick={closeOnOverlayClick}
		>
			<AlertDialogOverlay zIndex={8000}>
				<AlertDialogContent>
					<AlertDialogHeader color={colorPalette.textColor} fontSize='lg' fontWeight='bold'>
						{alertTitle}
					</AlertDialogHeader>
					<AlertDialogCloseButton onClick={onClickClose} />
					<AlertDialogBody>
						{alertBody}
					</AlertDialogBody>
					<AlertDialogFooter>{buttonBody}</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

export default AlertModal;
