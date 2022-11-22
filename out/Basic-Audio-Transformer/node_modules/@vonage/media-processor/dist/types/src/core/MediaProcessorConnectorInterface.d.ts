/**
 * Interface definition for media processor connector instances.
 */
export interface MediaProcessorConnectorInterface {
    /**
     * Sets the media stream track instance to be processed.
     *
     * @param track MeadiaStreamTrack (audio or video) to be processed.
     *
     * @returns Promise<MediaStreamTrack> MeadiaStreamTrack instance already processed.
     */
    setTrack(track: MediaStreamTrack): Promise<MediaStreamTrack>;
    /**
     * Stops the media processing being performed.
     */
    destroy(): Promise<void>;
}
