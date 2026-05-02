'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  MEMBER_STATS,
  RECENT_INVITATIONS,
  RSVP_DATA,
  VIEW_DATA,
} from '@/constants/member-dashboard';
import { BarChart3, FileHeart, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function MemberDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground mb-2 font-serif text-4xl font-bold">
            Dashboard Anda
          </h1>
          <p className="text-muted-foreground">
            Kelola undangan pernikahan Anda dengan mudah
          </p>
        </div>
        <Link href="/dashboard/member/buat">
          <Button className="bg-primary hover:bg-primary-dark gap-2 text-white">
            <Plus className="h-4 w-4" />
            Buat Undangan
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {MEMBER_STATS.map((stat) => (
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
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sidebar-border p-6">
          <h2 className="text-foreground mb-6 font-serif text-xl font-bold">
            Tren Views
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={VIEW_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D4D0" />
              <XAxis dataKey="date" stroke="#8B7355" />
              <YAxis stroke="#8B7355" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF7F4',
                  border: '1px solid #C9A0A0',
                }}
                cursor={{ stroke: '#C9A0A0' }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#C9A0A0"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-sidebar-border p-6">
          <h2 className="text-foreground mb-6 font-serif text-xl font-bold">
            Status RSVP
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={RSVP_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              ></Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="border-sidebar-border p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground font-serif text-xl font-bold">
            Undangan Terbaru
          </h2>
          <Link
            href="/dashboard/member/kelola"
            className="text-accent text-sm font-medium hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="space-y-4">
          {RECENT_INVITATIONS.map((invitation) => (
            <div
              key={invitation.id}
              className="bg-sidebar/30 hover:bg-sidebar/50 flex items-center justify-between rounded-lg p-4 transition-colors"
            >
              <div>
                <h3 className="text-foreground mb-1 font-medium">
                  {invitation.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {invitation.date}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-muted-foreground mb-1 text-xs">Views</p>
                  <p className="text-foreground text-lg font-bold">
                    {invitation.views}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground mb-1 text-xs">RSVP</p>
                  <p className="text-accent text-lg font-bold">
                    {invitation.rsvp}
                  </p>
                </div>
                <Link href={`/undangan/pernikahan-kami`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-sidebar-border"
                  >
                    Lihat
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-sidebar-border bg-primary/5 p-6">
          <FileHeart className="text-primary mb-3 h-8 w-8" />
          <h3 className="text-foreground mb-2 font-serif font-bold">
            Buat Undangan Baru
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Mulai buat undangan pernikahan Anda dengan template pilihan.
          </p>
          <Link href="/dashboard/member/buat">
            <Button className="bg-primary hover:bg-primary-dark gap-2 text-white">
              Mulai Membuat
            </Button>
          </Link>
        </Card>

        <Card className="border-sidebar-border bg-accent/5 p-6">
          <BarChart3 className="text-accent mb-3 h-8 w-8" />
          <h3 className="text-foreground mb-2 font-serif font-bold">
            Lihat Analytics
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Analisis performa undangan Anda secara detail.
          </p>
          <Link href="/dashboard/member/analytics">
            <Button
              variant="outline"
              className="border-sidebar-border hover:bg-sidebar/50"
            >
              Buka Analytics
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
