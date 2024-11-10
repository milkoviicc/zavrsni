import React, {useState} from 'react'

import {Flex, Avatar} from '@radix-ui/themes'
import { Button } from '@/src/components/ui/button';

const PostComment = () => {

  const [content, setContent] = useState('');

  return (
    <div>
        <div className="flex gap-2 items-center flex-col w-fit">
            <div className="flex flex-row w-fit justify-center items-center gap-4">
              <Flex gap="2">
                <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="A" />
              </Flex>
              <textarea placeholder="Tell us what you think." value={content} rows={2} cols={50} onChange={(e) => setContent(e.target.value)} className="w-full placeholder-gray-900 text-gray-900 bg-transparent resize-none border-b-2 px-2 py-1 border-gray-800 hover:border-gray-600 focus:border-gray-600 transition-all outline-none"></textarea>
            </div>
            <div className="w-full flex justify-end">
              <Button variant="shine">Post</Button>
            </div>
          </div>
    </div>
  )
}

export default PostComment