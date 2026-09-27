import LinkTabs from "@/components/navigation/LinkTabs";

const personTabs = [
  { label: "Students", href: "/persons/students" },
  { label: "Parents", href: "/persons/parents" },
  { label: "Staffs", href: "/persons/staffs" },
];

/** Navigation between the students, parents, and staff lists. */
export default function PersonsTabs() {
  return <LinkTabs tabs={personTabs} ariaLabel="Persons Tabs" />;
}
