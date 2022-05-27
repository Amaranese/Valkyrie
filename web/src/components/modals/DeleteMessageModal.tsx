import {
  Avatar,
  Box,
  Button,
  Flex,
  LightMode,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { deleteMessage } from '../../lib/api/handler/messages';
import { getTime } from '../../lib/utils/dateUtils';
import { Message } from '../../lib/models/message';

interface IProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteMessageModal: React.FC<IProps> = ({ message, isOpen, onClose }) => {
  const [showError, toggleShow] = useState(false);

  const handleDelete = async (): Promise<void> => {
    try {
      const { data } = await deleteMessage(message.id);
      if (data) {
        onClose();
      }
    } catch (err) {
      toggleShow(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent bg="brandGray.light">
        <ModalHeader fontWeight="bold" mb={0} pb={0}>
          Delete Message
        </ModalHeader>
        <ModalBody>
          <Text mb="4">Are you sure you want to delete this message?</Text>

          <Flex alignItems="center" my="2" mr="1" justify="space-between" boxShadow="dark-lg" py={2}>
            <Flex>
              <Avatar h="40px" w="40px" ml="4" mt="1" src={message.user.image} />
              <Box ml="3">
                <Flex alignItems="center">
                  <Text>{message.user.username}</Text>
                  <Text fontSize="12px" color="brandGray.accent" ml="3">
                    {getTime(message.createdAt)}
                  </Text>
                </Flex>
                <Text>{message.attachment?.filename ?? message.text}</Text>
              </Box>
            </Flex>
          </Flex>

          {showError && (
            <Text my="2" color="menuRed" align="center">
              Server Error. Try again later
            </Text>
          )}
        </ModalBody>

        <ModalFooter bg="brandGray.dark">
          <Button onClick={onClose} mr={6} variant="link" fontSize="14px" _focus={{ outline: 'none' }}>
            Cancel
          </Button>
          <LightMode>
            <Button type="submit" colorScheme="red" fontSize="14px" onClick={() => handleDelete()}>
              Delete
            </Button>
          </LightMode>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
