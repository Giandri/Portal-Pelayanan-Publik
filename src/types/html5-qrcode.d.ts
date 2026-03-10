declare module 'html5-qrcode' {
    export interface CameraDevice {
        id: string;
        label: string;
    }

    export interface Html5QrcodeConfig {
        fps?: number;
        qrbox?: { width: number; height: number } | number;
        aspectRatio?: number;
        disableFlip?: boolean;
    }

    export class Html5Qrcode {
        constructor(elementId: string, verbose?: boolean);
        start(
            cameraIdOrConfig: string | { facingMode: string },
            configuration: Html5QrcodeConfig,
            qrCodeSuccessCallback: (decodedText: string, result?: any) => void,
            qrCodeErrorCallback?: (errorMessage: string, error?: any) => void
        ): Promise<void>;
        stop(): Promise<void>;
        clear(): void;
        isScanning: boolean;
        static getCameras(): Promise<CameraDevice[]>;
    }

    export class Html5QrcodeScanner {
        constructor(elementId: string, config: any, verbose: boolean);
        render(onScanSuccess: (decodedText: string) => void, onScanError: (errorMessage: string) => void): void;
        clear(): Promise<void>;
    }
}
