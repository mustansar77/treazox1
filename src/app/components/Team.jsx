"use client";

import React, { useState } from "react";

const Team = () => {
  const teamData = [
    {
      name: "Mustansar Hussain Tariq",
      level: 1,
      members: [
        {
          name: "Jane Doe",
          level: 2,
          members: [
            { name: "John Smith", level: 3 },
            { name: "Alice Brown", level: 3 },
          ],
        },
        {
          name: "Michael Johnson",
          level: 2,
          members: [{ name: "Emma Davis", level: 3 }],
        },
      ],
    },
    {
      name: "Sarah Wilson",
      level: 1,
      members: [],
    },
  ];

  const [openLevels, setOpenLevels] = useState({
    level1: true,
    level2: false,
    level3: false,
  });

  const toggleLevel = (level) => {
    setOpenLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const level2Members = teamData.flatMap((l1) => l1.members || []);
  const level3Members = level2Members.flatMap((l2) => l2.members || []);

  const renderMember = (member) => (
    <div
      key={member.name}
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-2"
    >
      <p className="text-gray-900 dark:text-white font-semibold">{member.name}</p>
    </div>
  );

  return (
   <>
   <div className="bg-gray-100 dark:bg-gray-900">
 <div className="max-w-[1170px] min-h-screen mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-white text-center">
        My Team
      </h1>

      {/* Level 1 */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer py-4 px-3 rounded-[6px] mb-2 bg-gray-100 dark:bg-gray-800"
          onClick={() => toggleLevel("level1")}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Level 1 - Direct Referrals
          </h2>
          <span className="text-gray-500 dark:text-gray-300">
            {openLevels.level1 ? "-" : "+"}
          </span>
        </div>
        {openLevels.level1 && teamData.map(renderMember)}
      </div>

      {/* Level 2 */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer py-4 px-3 rounded-[6px] mb-2 bg-gray-100 dark:bg-gray-800"
          onClick={() => toggleLevel("level2")}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Level 2 - Indirect Referrals
          </h2>
          <span className="text-gray-500 dark:text-gray-300">
            {openLevels.level2 ? "-" : "+"}
          </span>
        </div>
        {openLevels.level2 && level2Members.map(renderMember)}
      </div>

      {/* Level 3 */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer py-4 px-3 rounded-[6px] mb-2 bg-gray-100 dark:bg-gray-800"
          onClick={() => toggleLevel("level3")}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Level 3 - Indirect Referrals of Level 2
          </h2>
          <span className="text-gray-500 dark:text-gray-300">
            {openLevels.level3 ? "-" : "+"}
          </span>
        </div>
        {openLevels.level3 && level3Members.map(renderMember)}
      </div>
    </div>

   </div>
   </>
  );
};

export default Team;
