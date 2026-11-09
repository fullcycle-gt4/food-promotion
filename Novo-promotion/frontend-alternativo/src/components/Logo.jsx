export default function Logo() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-[3px] flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-accent text-[13px] font-bold text-brand">
        F
      </div>
      <div className="text-[19px] font-semibold leading-[1.15] text-white">
        Food
        <br />
        <span className="text-accent">Promotion</span>
      </div>
    </div>
  );
}
