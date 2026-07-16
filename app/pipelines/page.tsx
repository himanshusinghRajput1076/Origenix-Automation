import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PipelinesPage() {
  const pipelines = await db.pipeline.findMany({
    include: {
      stages: {
        orderBy: { order: 'asc' },
        include: {
          deals: true
        }
      }
    }
  });

  // For simplicity in MVP, we just show the first pipeline if any
  const activePipeline = pipelines[0];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pipelines</h1>
          <div className="flex gap-2 mt-2">
            {pipelines.map(p => (
              <button key={p.id} className={`px-3 py-1 text-sm rounded-full ${p.id === activePipeline?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm">
          New Deal
        </button>
      </div>

      {!activePipeline ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl bg-card">
          <p className="text-muted-foreground mb-4">No pipelines defined yet.</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
          {activePipeline.stages.map(stage => (
            <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col gap-3 bg-muted/30 rounded-xl p-3 border">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-semibold text-sm">{stage.name}</h3>
                <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border">
                  {stage.deals.length}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {stage.deals.map(deal => (
                  <div key={deal.id} className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <p className="font-medium text-sm mb-1">{deal.title}</p>
                    {deal.value && <p className="text-xs font-semibold text-green-600">${deal.value.toLocaleString()}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
