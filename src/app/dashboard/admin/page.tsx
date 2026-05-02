'use client';

import { Card } from '@/components/ui/card';
import {
  ADMIN_STATS,
  ANALYTICS_DATA,
  PACKAGE_DISTRIBUTION,
  RECENT_ACTIVITY,
} from '@/constants/admin-dashboard';
import { FileHeart } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground mb-2 font-serif text-4xl font-bold">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Kelola semua aspek platform{' '}
          {process.env.NEXT_PUBLIC_APP_ALIAS ||
            process.env.NEXT_PUBLIC_APP_NAME ||
            'Configure on ENV'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ADMIN_STATS.map((stat) => (
          <Card
            key={stat.label}
            className="border-sidebar-border p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">
                  {stat.label}
                </p>
                <p className="text-foreground font-serif text-3xl font-bold">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} bg-primary/10 rounded-lg p-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-accent text-xs font-medium">{stat.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sidebar-border p-6">
          <h2 className="text-foreground mb-6 font-serif text-xl font-bold">
            Pertumbuhan Member & Undangan
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D4D0" />
              <XAxis dataKey="month" stroke="#8B7355" />
              <YAxis stroke="#8B7355" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF7F4',
                  border: '1px solid #C9A0A0',
                }}
                cursor={{ stroke: '#C9A0A0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="members"
                stroke="#C9A0A0"
                strokeWidth={2}
                name="Member"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="invitations"
                stroke="#C9A84C"
                strokeWidth={2}
                name="Undangan"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-sidebar-border p-6">
          <h2 className="text-foreground mb-6 font-serif text-xl font-bold">
            RSVP Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D4D0" />
              <XAxis dataKey="month" stroke="#8B7355" />
              <YAxis stroke="#8B7355" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF7F4',
                  border: '1px solid #C9A0A0',
                }}
                cursor={{ fill: '#E8D4D0' }}
              />
              <Bar dataKey="rsvp" fill="#C9A0A0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sidebar-border p-6">
          <h2 className="text-foreground mb-6 font-serif text-xl font-bold">
            Distribusi Member per Paket
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={PACKAGE_DISTRIBUTION}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              ></Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-sidebar-border p-6">
          <h2 className="text-foreground mb-6 font-serif text-xl font-bold">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="border-sidebar-border flex gap-4 border-b pb-4 last:border-b-0"
              >
                <div className="bg-accent/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                  <FileHeart className="text-accent h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate font-medium">
                    {activity.member}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {activity.action}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
