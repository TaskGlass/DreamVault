"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Shield, Activity, Clock, Users, AlertCircle } from 'lucide-react'

interface SecurityAlert {
  level: 'low' | 'medium' | 'high' | 'critical'
  event: string
  details: any
  timestamp: string
  userId?: string
  ip?: string
}

interface SecurityMetrics {
  totalAlerts: number
  criticalAlerts: number
  highAlerts: number
  mediumAlerts: number
  lowAlerts: number
  recentAlerts: SecurityAlert[]
}

export function SecurityMonitoring() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // In a real implementation, this would fetch from your security monitoring service
    // For now, we'll simulate some data
    const fetchMetrics = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockMetrics: SecurityMetrics = {
        totalAlerts: 24,
        criticalAlerts: 2,
        highAlerts: 5,
        mediumAlerts: 8,
        lowAlerts: 9,
        recentAlerts: [
          {
            level: 'critical',
            event: 'MULTIPLE_FAILED_LOGINS',
            details: { userId: 'user123', attempts: 15, ip: '192.168.1.100' },
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            userId: 'user123',
            ip: '192.168.1.100'
          },
          {
            level: 'high',
            event: 'RATE_LIMIT_EXCEEDED',
            details: { userId: 'user456', path: '/api/chat', requests: 50 },
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            userId: 'user456',
            ip: '192.168.1.101'
          },
          {
            level: 'medium',
            event: 'SUSPICIOUS_REQUEST',
            details: { path: '/api/profile', userAgent: 'sqlmap' },
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            ip: '192.168.1.102'
          }
        ]
      }
      
      setMetrics(mockMetrics)
      setLoading(false)
    }

    fetchMetrics()
  }, [])

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertCircle className="h-4 w-4" />
      case 'medium': return <Activity className="h-4 w-4" />
      case 'low': return <Clock className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading security metrics...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Unable to load security metrics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Monitoring
        </CardTitle>
        <CardDescription>
          Real-time security alerts and metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{metrics.criticalAlerts}</div>
            <div className="text-xs text-gray-500">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{metrics.highAlerts}</div>
            <div className="text-xs text-gray-500">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{metrics.mediumAlerts}</div>
            <div className="text-xs text-gray-500">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{metrics.lowAlerts}</div>
            <div className="text-xs text-gray-500">Low</div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          <div className="space-y-3">
            {metrics.recentAlerts.map((alert, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getAlertColor(alert.level)} text-white`}>
                      {getAlertIcon(alert.level)}
                    </div>
                    <div>
                      <div className="font-medium">{alert.event}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={alert.level === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.level}
                  </Badge>
                </div>
                
                {showDetails && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">IP:</span> {alert.ip || 'Unknown'}
                      </div>
                      {alert.userId && (
                        <div>
                          <span className="font-medium">User:</span> {alert.userId}
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="font-medium">Details:</span>
                        <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                          {JSON.stringify(alert.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">
                Security Status: Good
              </div>
              <div className="text-sm text-green-600 dark:text-green-300">
                All critical systems are functioning normally
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
