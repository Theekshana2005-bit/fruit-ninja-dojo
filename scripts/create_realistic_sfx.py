import math
import random
import struct
import wave
import os

SAMPLE_RATE = 44100

def write_wav(filepath, samples, channels=1, sample_rate=SAMPLE_RATE):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    # Normalize
    max_val = max(abs(s) for s in samples) if samples else 1.0
    if max_val > 0.001:
        scale = 0.94 / max_val
        samples = [s * scale for s in samples]
    else:
        samples = [0.0] * len(samples)

    with wave.open(filepath, 'w') as w:
        w.setnchannels(channels)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        raw = bytearray()
        for s in samples:
            val = int(max(-32767, min(32767, s * 32767)))
            raw.extend(struct.pack('<h', val))
        w.writeframes(raw)
    print(f"Generated {filepath}: {len(samples)/sample_rate:.2f}s")

# 1. Realistic Katana Sword Swish
def generate_katana_swoosh():
    duration = 0.14
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    b0 = b1 = b2 = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = i / num_samples
        
        # Envelope: fast sharp rise in 28ms, smooth aerodynamic tail
        if progress < 0.22:
            env = math.sin((progress / 0.22) * (math.pi / 2))
        else:
            env = math.exp(-(progress - 0.22) * 6.5)
            
        white = random.uniform(-1, 1)
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        noise = (b0 + b1 + b2 + white * 0.5362) * 0.35
        
        # Steel blade resonance sweep
        sweep_freq = 700 + 2200 * math.sin(progress * math.pi)
        steel_ring = math.sin(2 * math.pi * sweep_freq * t) * 0.3
        
        # High-frequency whistle
        whistle_freq = 1900 + 800 * math.sin(progress * math.pi)
        whistle = math.sin(2 * math.pi * whistle_freq * t) * 0.15
        
        samples[i] = (noise * 0.75 + steel_ring * 0.35 + whistle * 0.2) * env
        
    return samples

# 2. Realistic Juicy Fruit Splat (Watermelon, Citrus, Apple, Melon)
def generate_fruit_splat(variety=1):
    duration = 0.19
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    # Variety characteristics:
    # 1: Watermelon (deep resonant crunch, huge wet gush)
    # 2: Citrus / Orange (crisp blade cut, high-pressure juice spray)
    # 3: Apple / Firm fruit (sharp crack, crisp snap)
    # 4: Soft Melon / Papaya (thick wet squishy pulp)
    
    base_snap_freq = {1: 2800, 2: 3400, 3: 4200, 4: 2200}[variety]
    pulp_base_freq = {1: 340, 2: 440, 3: 520, 4: 280}[variety]
    decay_speed = {1: 6.0, 2: 7.2, 3: 8.5, 4: 5.2}[variety]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = i / num_samples
        
        # Attack envelope
        if progress < 0.07:
            env = progress / 0.07
        else:
            env = math.exp(-(progress - 0.07) * decay_speed)
            
        # A. Transient Blade Chop / Snap (initial 22ms)
        snap = 0.0
        if t < 0.024:
            snap_env = math.exp(-t * 220)
            snap_f = base_snap_freq * math.exp(-t * 40)
            snap = math.sin(2 * math.pi * snap_f * t) * snap_env * 0.85
            
        # B. Wet Pulp Squelch (Liquid friction)
        pulp_f = pulp_base_freq * math.exp(-t * 18)
        pulp = math.sin(2 * math.pi * pulp_f * t + random.uniform(-0.35, 0.35)) * 0.6
        
        # C. Watery Juice Droplets Spray
        splash_noise = random.uniform(-1, 1) * math.exp(-t * 16) * 0.5
        
        # D. Granular micro-pops (bursting juice vesicles)
        micro_pops = 0.0
        if 0.015 < t < 0.11:
            if random.random() < 0.14:
                pop_f = random.uniform(1200, 3200)
                micro_pops = math.sin(2 * math.pi * pop_f * t) * random.uniform(0.3, 0.7)
                
        samples[i] = (snap * 0.7 + pulp * 0.55 + splash_noise * 0.45 + micro_pops * 0.4) * env
        
    return samples

# 3. Critical Slash (Sub-bass impact + razor whip)
def generate_critical_hit():
    duration = 0.32
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 8.5)
        
        # Heavy sub-bass thud
        sub = math.sin(2 * math.pi * (110 * math.exp(-t * 12) + 35) * t) * 0.8
        
        # Whip slash
        white = random.uniform(-1, 1) * math.exp(-t * 14) * 0.6
        blade = math.sin(2 * math.pi * 1600 * t) * math.exp(-t * 25) * 0.4
        
        samples[i] = (sub * 0.7 + white * 0.45 + blade * 0.35) * env
        
    return samples

# 4. Combo Burst (Harmonious double slash + celebration chime)
def generate_combo():
    duration = 0.42
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    # Insen pentatonic arpeggio (D5, G5, A5)
    notes = [587.33, 783.99, 880.0]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val = 0.0
        
        # Chimes
        for idx, freq in enumerate(notes):
            offset = idx * 0.045
            if t >= offset:
                rel_t = t - offset
                chime_env = math.exp(-rel_t * 9.0)
                chime = math.sin(2 * math.pi * freq * rel_t) * chime_env * 0.35
                val += chime
                
        # Juicy double slice burst
        slice1 = (math.sin(2 * math.pi * 320 * t) * 0.4 + random.uniform(-1, 1) * 0.4) * math.exp(-t * 18)
        slice2 = 0.0
        if t > 0.06:
            slice2 = (math.sin(2 * math.pi * 480 * (t - 0.06)) * 0.4 + random.uniform(-1, 1) * 0.4) * math.exp(-(t - 0.06) * 18)
            
        samples[i] = val + slice1 * 0.5 + slice2 * 0.5
        
    return samples

# 5. Bomb Detonation (Sub-bass cinematic boom & fireball rumble)
def generate_bomb_explosion():
    duration = 0.95
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 3.4)
        
        # Sub-bass punch dropping from 140Hz to 24Hz
        sub_freq = 140 * math.exp(-t * 3.8) + 24
        sub = math.sin(2 * math.pi * sub_freq * t) * 0.8
        
        # Roaring detonation noise
        noise = random.uniform(-1, 1) * math.exp(-t * 3.8) * 0.65
        
        samples[i] = (sub * 0.7 + noise * 0.5) * env
        
    return samples

# 6. Strike Miss (Wooden hyoshigi mallet strike)
def generate_strike():
    duration = 0.22
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 15.0)
        pitch = 165 * math.exp(-t * 22) + 40
        tone = math.sin(2 * math.pi * pitch * t) * 0.7
        thud = random.uniform(-1, 1) * math.exp(-t * 40) * 0.4
        samples[i] = (tone * 0.75 + thud * 0.4) * env
        
    return samples

# 7. Authentic Bronze Temple Gong (Game Over)
def generate_temple_gong():
    duration = 2.8
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    # Authentic Japanese Rin Gong / Bronze Bell partials
    partials = [
        (108.0, 0.65, 1.8),
        (162.5, 0.45, 2.2),
        (216.0, 0.35, 2.5),
        (324.2, 0.22, 2.8),
        (432.0, 0.15, 3.2),
        (648.5, 0.08, 3.8),
    ]
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val = 0.0
        for freq, amp, decay in partials:
            # Slight 1.2Hz acoustic chorus beating
            beat = 1.0 + 0.08 * math.sin(2 * math.pi * 1.2 * t)
            env = math.exp(-t * decay)
            val += math.sin(2 * math.pi * freq * t) * amp * env * beat
            
        # Initial felt mallet impact
        mallet = math.exp(-t * 45) * math.sin(2 * math.pi * 65 * t) * 0.5 if t < 0.08 else 0.0
        samples[i] = val + mallet
        
    return samples

# 8. Crisp Bamboo Woodblock UI Click
def generate_click():
    duration = 0.045
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        env = math.exp(-t * 90.0)
        tone = (math.sin(2 * math.pi * 680 * t) * 0.6 + math.sin(2 * math.pi * 1150 * t) * 0.4)
        samples[i] = tone * env
        
    return samples

# 9. Realistic Ambient Japanese Zen Background Music (Shakuhachi & Koto & Temple Drone)
def generate_zen_bgm():
    # 45-second seamless ambient Japanese meditation piece
    duration = 45.0
    num_samples = int(SAMPLE_RATE * duration)
    samples = [0.0] * num_samples
    
    print("Synthesizing ambient Japanese Zen Dojo BGM...")
    
    # A. Warm Tanpura / Singing Bowl meditation drone (D2, A2, D3)
    drone_notes = [(73.42, 0.22), (110.0, 0.18), (146.83, 0.14)]
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        # Gentle ambient swell LFO (0.05 Hz = 20s cycle)
        swell = 0.85 + 0.15 * math.sin(2 * math.pi * 0.05 * t)
        drone_val = 0.0
        for freq, amp in drone_notes:
            drone_val += math.sin(2 * math.pi * freq * t) * amp
        samples[i] = drone_val * swell
        
    # B. Shakuhachi Flute Phrases (Hirajoshi scale: D4, Eb4, G4, A4, Bb4, D5)
    # Melodic notes: (start_time, duration, frequency)
    flute_phrases = [
        (1.5, 3.2, 293.66),   # D4
        (4.2, 2.8, 311.13),   # Eb4
        (6.8, 4.0, 392.00),   # G4
        (11.5, 3.5, 440.00),  # A4
        (14.5, 3.0, 392.00),  # G4
        (17.2, 4.5, 293.66),  # D4
        (22.8, 3.0, 466.16),  # Bb4
        (25.5, 3.5, 440.00),  # A4
        (28.8, 4.2, 392.00),  # G4
        (33.5, 3.2, 311.13),  # Eb4
        (36.2, 4.5, 293.66),  # D4
    ]
    
    for start_t, note_dur, freq in flute_phrases:
        start_idx = int(start_t * SAMPLE_RATE)
        note_samples = int(note_dur * SAMPLE_RATE)
        end_idx = min(num_samples, start_idx + note_samples)
        
        for idx in range(start_idx, end_idx):
            t_note = (idx - start_idx) / SAMPLE_RATE
            progress = t_note / note_dur
            
            # Flute envelope: gentle breath in, sustain, soft fade out
            if progress < 0.2:
                env = math.sin((progress / 0.2) * (math.pi / 2))
            elif progress > 0.7:
                env = math.sin(((1.0 - progress) / 0.3) * (math.pi / 2))
            else:
                env = 1.0
                
            # Natural Meri-Kari pitch vibrato (4.8 Hz, onset after 0.5s)
            vib_amp = 0.012 * min(1.0, max(0.0, (t_note - 0.4) / 0.6))
            vib = 1.0 + vib_amp * math.sin(2 * math.pi * 4.8 * t_note)
            current_f = freq * vib
            
            # Authentic Shakuhachi tone (fundamental + gentle odd harmonics + breath noise)
            tone = (
                math.sin(2 * math.pi * current_f * t_note) * 0.75 +
                math.sin(2 * math.pi * current_f * 2 * t_note) * 0.18 +
                math.sin(2 * math.pi * current_f * 3 * t_note) * 0.12
            )
            # Breath noise
            breath = random.uniform(-1, 1) * 0.08
            samples[idx] += (tone + breath) * env * 0.32
            
    # C. Plucked Koto Harp Arpeggios (Hirajoshi scale)
    koto_notes = [
        (3.0, 587.33), (8.5, 440.0), (9.2, 392.0),
        (13.5, 587.33), (19.0, 311.13), (20.0, 293.66),
        (24.5, 466.16), (29.5, 440.0), (30.2, 392.0),
        (35.0, 587.33), (40.0, 293.66)
    ]
    for pluck_t, k_freq in koto_notes:
        start_idx = int(pluck_t * SAMPLE_RATE)
        pluck_len = int(2.4 * SAMPLE_RATE)
        end_idx = min(num_samples, start_idx + pluck_len)
        
        for idx in range(start_idx, end_idx):
            t_pluck = (idx - start_idx) / SAMPLE_RATE
            # Koto plucked decay
            k_env = math.exp(-t_pluck * 3.8)
            k_tone = (
                math.sin(2 * math.pi * k_freq * t_pluck) * 0.6 +
                math.sin(2 * math.pi * k_freq * 2 * t_pluck) * 0.3 +
                math.sin(2 * math.pi * k_freq * 3 * t_pluck) * 0.12
            )
            samples[idx] += k_tone * k_env * 0.22
            
    return samples

if __name__ == '__main__':
    out_dir = 'public/audio'
    write_wav(f'{out_dir}/swoosh.wav', generate_katana_swoosh())
    write_wav(f'{out_dir}/splat1.wav', generate_fruit_splat(1)) # Watermelon
    write_wav(f'{out_dir}/splat2.wav', generate_fruit_splat(2)) # Citrus
    write_wav(f'{out_dir}/splat3.wav', generate_fruit_splat(3)) # Apple
    write_wav(f'{out_dir}/splat4.wav', generate_fruit_splat(4)) # Melon
    write_wav(f'{out_dir}/critical.wav', generate_critical_hit())
    write_wav(f'{out_dir}/combo.wav', generate_combo())
    write_wav(f'{out_dir}/bomb_explode.wav', generate_bomb_explosion())
    write_wav(f'{out_dir}/strike.wav', generate_strike())
    write_wav(f'{out_dir}/gameover.wav', generate_temple_gong())
    write_wav(f'{out_dir}/click.wav', generate_click())
    
    # Generate BGM wav, then encode to high quality lightweight mp3 using ffmpeg
    bgm_samples = generate_zen_bgm()
    write_wav(f'{out_dir}/bgm.wav', bgm_samples)
    print("Done generating all audio assets!")
