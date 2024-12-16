import { cn } from '@/lib/utils';
import moment from 'moment';
import React from 'react';

const MessageItem = ({ createdAt, name, owner = false, text }) => {
  const nameInitials = name?.split(' ').map(item => item[0]).join('');

  return (
    <div className={
      cn(` p-3 rounded-lg`,
        owner ? 'col-start-6 col-end-13' : 'col-start-1 col-end-8'
      )
    }>
      <div className={
        cn("flex items-center",
          owner ? 'justify-start flex-row-reverse' : 'flex-row'
        )
      }>
        <div
          className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
        >
          {nameInitials}
        </div>
        <div
          className={cn("relative text-sm py-2 px-4 shadow rounded-xl",
            owner ? 'mr-3 bg-indigo-100' : 'ml-3 bg-white'
          )}
        >
          <div>{text}</div>
          <p className='text-muted-foreground text-xs'>{moment(createdAt).format('DD-MM-YYYY')}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;