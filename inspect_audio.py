"""
Script para inspeccionar el formato real de un archivo de audio
"""
import sys

def inspect_audio_file(filepath):
    """Inspecciona los primeros bytes de un archivo de audio"""
    print("=" * 60)
    print("INSPECCIÓN DE ARCHIVO DE AUDIO")
    print("=" * 60)
    
    with open(filepath, 'rb') as f:
        # Leer los primeros 44 bytes (header estándar de WAV)
        header = f.read(44)
        
        print(f"\nArchivo: {filepath}")
        print(f"Tamaño total: {len(header) + len(f.read())} bytes")
        
        # Mostrar primeros bytes en hex y ASCII
        print("\nPrimeros 44 bytes (header):")
        print("Offset  Hex                                          ASCII")
        print("-" * 60)
        
        for i in range(0, len(header), 16):
            chunk = header[i:i+16]
            hex_str = ' '.join(f'{b:02x}' for b in chunk)
            ascii_str = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
            print(f"{i:04x}    {hex_str:<48} {ascii_str}")
        
        # Identificar formato
        print("\n" + "=" * 60)
        print("IDENTIFICACIÓN DE FORMATO")
        print("=" * 60)
        
        # Resetear para leer desde el inicio
        f.seek(0)
        magic = f.read(12)
        
        if magic[:4] == b'RIFF' and magic[8:12] == b'WAVE':
            print("✓ Formato: WAV (RIFF WAVE)")
            f.seek(0)
            analyze_wav(f)
        elif magic[:4] == b'ftyp' or magic[4:8] == b'ftyp':
            print("⚠ Formato: MP4/M4A (MPEG-4)")
            print("  Este es el formato que usa Apple AAC")
        elif magic[:3] == b'ID3' or magic[:2] == b'\xff\xfb' or magic[:2] == b'\xff\xf3':
            print("⚠ Formato: MP3")
        elif magic[:4] == b'OggS':
            print("⚠ Formato: OGG")
        elif magic[:4] == b'fLaC':
            print("⚠ Formato: FLAC")
        else:
            print(f"❓ Formato desconocido")
            print(f"   Magic bytes: {magic[:12].hex()}")
            print(f"   ASCII: {magic[:12]}")

def analyze_wav(f):
    """Analiza un archivo WAV válido"""
    f.seek(0)
    
    # RIFF header
    riff = f.read(4)
    size = int.from_bytes(f.read(4), 'little')
    wave = f.read(4)
    
    print(f"\nRIFF Header:")
    print(f"  ChunkID: {riff.decode()}")
    print(f"  ChunkSize: {size}")
    print(f"  Format: {wave.decode()}")
    
    # fmt subchunk
    fmt_id = f.read(4)
    fmt_size = int.from_bytes(f.read(4), 'little')
    audio_format = int.from_bytes(f.read(2), 'little')
    num_channels = int.from_bytes(f.read(2), 'little')
    sample_rate = int.from_bytes(f.read(4), 'little')
    byte_rate = int.from_bytes(f.read(4), 'little')
    block_align = int.from_bytes(f.read(2), 'little')
    bits_per_sample = int.from_bytes(f.read(2), 'little')
    
    print(f"\nfmt Subchunk:")
    print(f"  SubchunkID: {fmt_id.decode()}")
    print(f"  SubchunkSize: {fmt_size}")
    print(f"  AudioFormat: {audio_format} ({'PCM' if audio_format == 1 else 'compressed'})")
    print(f"  NumChannels: {num_channels} ({'mono' if num_channels == 1 else 'stereo'})")
    print(f"  SampleRate: {sample_rate} Hz")
    print(f"  ByteRate: {byte_rate}")
    print(f"  BlockAlign: {block_align}")
    print(f"  BitsPerSample: {bits_per_sample}")
    
    # Verificar requisitos de Azure
    print(f"\nCompatibilidad con Azure Speech:")
    print(f"  {'✓' if audio_format == 1 else '✗'} PCM format (no compressed)")
    print(f"  {'✓' if num_channels == 1 else '✗'} Mono (1 channel)")
    print(f"  {'✓' if bits_per_sample == 16 else '✗'} 16-bit")
    print(f"  {'✓' if sample_rate == 16000 else '✗'} 16kHz sample rate")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python inspect_audio.py <archivo>")
        sys.exit(1)
    
    inspect_audio_file(sys.argv[1])
