import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Message } from '../../../lib/models/message';

interface MessageProps {
  message: Message;
}

export const MessageContent: React.FC<MessageProps> = ({ message: { attachment, text, createdAt, updatedAt } }) => {
  if (attachment) {
    const { filetype, url } = attachment;
    if (filetype.startsWith('image/')) {
      return (
        <Box boxSize="sm" my="2" h="full">
          <Image fit="contain" src={url} alt="" borderRadius="md" />
        </Box>
      );
    }
    if (filetype.startsWith('audio/')) {
      return (
        <Box my="2">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </Box>
      );
    }
  }
  return (
    <Flex alignItems="center">
      <Text>{text}</Text>
      {createdAt !== updatedAt && (
        <Text fontSize="10px" ml="1" color="labelGray">
          (edited)
        </Text>
      )}
    </Flex>
  );
};
