import { useState, useCallback } from 'react'

/**
 * Client-side WebRTC leak detection hook.
 * 
 * WebRTC can reveal a user's real IP address even when using a VPN.
 * This hook creates a temporary RTCPeerConnection and collects
 * ICE candidates to detect if local/public IPs are being exposed.
 * 
 * No data is sent to any server — all detection happens locally.
 */

const PRIVATE_IP_REGEX = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|fd[0-9a-f]{2}:|fe80:)/i
const IP_REGEX = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/gi

export default function useWebRTCLeakCheck() {
  const [status, setStatus] = useState('idle') // idle | running | complete | error | unsupported
  const [leakedIPs, setLeakedIPs] = useState([])
  const [isLeaking, setIsLeaking] = useState(null)

  const runCheck = useCallback(async () => {
    if (typeof RTCPeerConnection === 'undefined') {
      setStatus('unsupported')
      return
    }

    setStatus('running')
    setLeakedIPs([])
    setIsLeaking(null)

    const foundIPs = new Set()
    let pc = null

    try {
      // Use Google's STUN server to trigger ICE candidate gathering
      pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })

      pc.createDataChannel('')

      pc.onicecandidate = (event) => {
        if (!event.candidate) return
        const matches = event.candidate.candidate.match(IP_REGEX)
        if (matches) {
          matches.forEach(ip => foundIPs.add(ip))
        }
      }

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // Also parse the SDP for IPs
      const sdp = pc.localDescription?.sdp || ''
      const sdpMatches = sdp.match(IP_REGEX)
      if (sdpMatches) {
        sdpMatches.forEach(ip => foundIPs.add(ip))
      }

      // Wait for ICE gathering to complete (max 5 seconds)
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 5000)
        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === 'complete') {
            clearTimeout(timeout)
            resolve()
          }
        }
      })

      const ips = Array.from(foundIPs).map(ip => ({
        address: ip,
        type: PRIVATE_IP_REGEX.test(ip) ? 'private' : 'public'
      }))

      const publicIPs = ips.filter(ip => ip.type === 'public')
      // If public IPs are found, WebRTC is leaking your real address
      setLeakedIPs(ips)
      setIsLeaking(publicIPs.length > 0)
      setStatus('complete')
    } catch {
      setStatus('error')
    } finally {
      if (pc) {
        pc.close()
      }
    }
  }, [])

  return { status, leakedIPs, isLeaking, runCheck }
}
