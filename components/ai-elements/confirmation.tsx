'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ToolUIPart } from 'ai';
import { CheckIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Confirmation,
  ConfirmationContent,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from '@/components/ai-elements/confirmation';
import { MessageResponse } from '@/components/ai-elements/message';
type DeleteFileInput = {
  filePath: string;
  confirm: boolean;
};
type DeleteFileToolUIPart = ToolUIPart<{
  delete_file: {
    input: DeleteFileInput;
    output: { success: boolean; message: string };
  };
}>;
const Example = () => {
  const { messages, sendMessage, status, respondToConfirmationRequest } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const handleDeleteFile = () => {
    sendMessage({ text: 'Delete the file at /tmp/example.txt' });
  };
  const latestMessage = messages[messages.length - 1];
  const deleteTool = latestMessage?.parts?.find(
    (part) => part.type === 'tool-delete_file'
  ) as DeleteFileToolUIPart | undefined;
  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full space-y-4">
        <Button onClick={handleDeleteFile} disabled={status !== 'ready'}>
          Delete Example File
        </Button>
        {deleteTool?.approval && (
          <Confirmation approval={deleteTool.approval} state={deleteTool.state}>
            <ConfirmationContent>
              <ConfirmationRequest>
                This tool wants to delete: <code>{deleteTool.input?.filePath}</code>
                <br />
                Do you approve this action?
              </ConfirmationRequest>
              <ConfirmationAccepted>
                <CheckIcon className="size-4" />
                <span>You approved this tool execution</span>
              </ConfirmationAccepted>
              <ConfirmationRejected>
                <XIcon className="size-4" />
                <span>You rejected this tool execution</span>
              </ConfirmationRejected>
            </ConfirmationContent>
            <ConfirmationActions>
              <ConfirmationAction
                variant="outline"
                onClick={() =>
                  respondToConfirmationRequest({
                    approvalId: deleteTool.approval!.id,
                    approved: false,
                  })
                }
              >
                Reject
              </ConfirmationAction>
              <ConfirmationAction
                variant="default"
                onClick={() =>
                  respondToConfirmationRequest({
                    approvalId: deleteTool.approval!.id,
                    approved: true,
                  })
                }
              >
                Approve
              </ConfirmationAction>
            </ConfirmationActions>
          </Confirmation>
        )}
        {deleteTool?.output && (
          <MessageResponse>
            {deleteTool.output.success
              ? deleteTool.output.message
              : `Error: ${deleteTool.output.message}`}
          </MessageResponse>
        )}
      </div>
    </div>
  );
};
export default Example;
