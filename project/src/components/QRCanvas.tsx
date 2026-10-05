import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { downloadCanvas } from '@/lib/helpers';

export function QRCanvas({
  value,
  size = 220,
  preview = false,
  qrId,
}: {
  value: string;
  size?: number;
  preview?: boolean;
  qrId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const doDownload = () => {
    const canvas = ref.current?.querySelector('canvas');
    downloadCanvas(canvas, `quantumseal-${qrId ?? 'qr'}.png`);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={ref}
        data-qr-id={qrId}
        className="rounded-2xl bg-white p-3 shadow-glow"
        style={{ width: preview ? size : undefined }}
      >
        <QRCodeCanvas
          value={value || ' '}
          size={size}
          level="H"
          includeMargin={false}
          fgColor="#1e1b4b"
          bgColor="#ffffff"
          imageSettings={{
            src:
              'data:image/svg+xml;base64,' +
              btoa(
                '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="10" fill="#6366f1"/><circle cx="20" cy="20" r="6" fill="#fff"/></svg>',
              ),
            height: 28,
            width: 28,
            excavate: true,
          }}
        />
      </div>
      {!preview && (
        <div className="flex gap-2">
          <button className="btn-ghost text-xs" onClick={doDownload}>Download</button>
        </div>
      )}
    </div>
  );
}

QRCanvas.download = (id: string) => {
  const wrapper = document.querySelector(`[data-qr-id="${id}"]`);
  const canvas = wrapper?.querySelector('canvas') as HTMLCanvasElement | null;
  downloadCanvas(canvas, `quantumseal-${id}.png`);
};
