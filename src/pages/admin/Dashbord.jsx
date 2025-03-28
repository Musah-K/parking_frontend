import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@apollo/client";
import { ALLUSERS } from "../../graphql/query/userQuery";
import { PARKINGSLOTS } from "../../graphql/query/parkingSlotsQuery";
import { ALLPAYMENTS } from "../../graphql/query/paymentQuery";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [usersLength, setUsersLength] = useState(0);
  const [staffLength, setStaffLength] = useState(0);
  const [booking, setBooking] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [weeklySum, setWeeklySum] = useState(0);

  const { data } = useQuery(ALLUSERS);
  const { data: bookings } = useQuery(PARKINGSLOTS);
  const { data: payments } = useQuery(ALLPAYMENTS);

  const navigate = useNavigate();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `Ksh. ${value}` },
      },
    },
  };

  // Fetch Clients & Staff
  useEffect(() => {
    if (data?.allUsers) {
      const clientsLength = data.allUsers.filter((x) => x.role === "client").length;
      const staff = data.allUsers.filter((x) => x.role === "worker").length;
      setUsersLength(clientsLength);
      setStaffLength(staff);
    }
  }, [data]);

  // Fetch Total Bookings
  useEffect(() => {
    if (bookings?.allParkingSlots) {
      const booked = bookings.allParkingSlots.filter((x) => !x.isAvailable).length;
      setBooking(booked);
    }
  }, [bookings]);

  useEffect(() => {
    if (!payments?.getAllPayments) return;

    const now = new Date();
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const daysToMonday = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const last7DaysRevenue = Array(7).fill(0);

    payments.getAllPayments.forEach((payment) => {
      const paymentDate = new Date(Number(payment.createdAt));
      paymentDate.setHours(0, 0, 0, 0);

      if (Number(payment.createdAt) >= oneMonthAgo) {
        setMonthlyRevenue((prev) => prev + payment.amount);
      }

      if (Number(payment.createdAt) >= todayDate.getTime()) {
        setDailyRevenue((prev) => prev + payment.amount);
      }

      if (paymentDate >= startOfWeek) {
        const dayIndex = (paymentDate.getDay() + 6) % 7;
        last7DaysRevenue[dayIndex] += payment.amount;
      }
    });

    setWeeklyRevenue(last7DaysRevenue);
    setWeeklySum(last7DaysRevenue.reduce((sum, amount) => sum + amount, 0));
  }, [payments]);

  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Revenue (Ksh)",
        data: weeklyRevenue,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
      },
    ],
  };

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
          <div className="w-full flex items-center justify-between">
              <span>{usersLength}</span>
              <button className="text-base font-medium text-blue-600 hover:underline"
              onClick={()=> navigate('clients')}>
                View
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
          <div className="w-full flex items-center justify-between">
              <span>{staffLength}</span>
              <button className="text-base font-medium text-blue-600 hover:underline"
              onClick={()=> navigate('employees')}>
                View
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
          <div className="w-full flex items-center justify-between">
              <span>{booking}</span>
              <button className="text-base font-medium text-blue-600 hover:underline"
              onClick={()=> navigate('bookings')}>
                View
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Monthly)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">Ksh. {monthlyRevenue}</CardContent>
        </Card>

        {/* Daily Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Today)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">Ksh. {dailyRevenue}</CardContent>
        </Card>

        {/* Weekly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Weekly)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">Ksh. {weeklySum}</CardContent>
        </Card>
      </div>

      {/* Revenue Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={revenueData} options={chartOptions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
