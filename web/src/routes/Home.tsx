import React from 'react';
import { useParams } from 'react-router-dom';
import { GuildList } from '../components/layouts/guild/GuildList';
import { DMSidebar } from '../components/layouts/home/DMSidebar';
import { FriendsDashboard } from '../components/layouts/home/dashboard/FriendsDashboard';
import { AppLayout } from '../components/layouts/AppLayout';
import { ChatScreen } from '../components/layouts/guild/chat/ChatScreen';
import { DMHeader } from '../components/layouts/home/DMHeader';
import { MessageInput } from '../components/layouts/guild/chat/MessageInput';
import { RouterProps } from '../lib/models/routerProps';

export const Home: React.FC = () => {
  const { channelId } = useParams<keyof RouterProps>() as RouterProps;

  return (
    <AppLayout>
      <GuildList />
      <DMSidebar />
      {channelId === undefined ? (
        <FriendsDashboard />
      ) : (
        <>
          <DMHeader />
          <ChatScreen />
          <MessageInput />
        </>
      )}
    </AppLayout>
  );
};
